import { expect } from "chai"
import { ethers, run } from "hardhat"
import { Signer } from "ethers"
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers"
import { Group, Identity, generateProof } from "@semaphore-protocol/core"
import { BigNumber } from "@ethersproject/bignumber"
// @ts-ignore
import { SemaphoreVoting } from "../typechain-types"

describe("SemaphoreVoting", () => {
    async function deploySemaphoreVotingFixture() {
        const semaphoreVoting = await run("deploy:semaphore-voting", {
            logs: false
        })

        const SemaphoreVotingContract: SemaphoreVoting = semaphoreVoting

        const accounts = await run("accounts", { logs: false })
        const accountAddresses = await Promise.all(accounts.map((signer: Signer) => signer.getAddress()))

        const coordinator = accounts[0]
        const voter = accounts[1]
        const identity = new Identity()
        const groupId = BigNumber.from(0)
        const group = new Group(groupId)
        group.addMember(identity.commitment)
        const vote = ethers.keccak256(ethers.toUtf8Bytes("vote"))
        const proof = await generateProof(identity, group, 0, vote)

        return { SemaphoreVotingContract, coordinator, voter, identity, group, vote, proof, accountAddresses }
    }

    describe("# createPoll", () => {
        it("Should create a poll", async () => {
            const { SemaphoreVotingContract, coordinator } = await loadFixture(deploySemaphoreVotingFixture)

            const pollId = 0
            const transaction = await SemaphoreVotingContract.createPoll(pollId, coordinator.address)

            await expect(transaction)
                .to.emit(SemaphoreVotingContract, "PollCreated")
                .withArgs(pollId, coordinator.address)
        })
    })

    describe("# addVoter", () => {
        it("Should add a voter to a poll", async () => {
            const { SemaphoreVotingContract, coordinator, identity } = await loadFixture(deploySemaphoreVotingFixture)

            const pollId = 0
            await SemaphoreVotingContract.createPoll(pollId, coordinator.address)

            const transaction = await SemaphoreVotingContract.addVoter(pollId, identity.commitment)

            await expect(transaction).to.emit(SemaphoreVotingContract, "MemberAdded")
        })

        it("Should not add a voter to a poll that has already been started", async () => {
            const { SemaphoreVotingContract, coordinator, identity } = await loadFixture(deploySemaphoreVotingFixture)

            const pollId = 0
            await SemaphoreVotingContract.createPoll(pollId, coordinator.address)
            await SemaphoreVotingContract.startPoll(pollId, 0)

            const transaction = SemaphoreVotingContract.addVoter(pollId, identity.commitment)

            await expect(transaction).to.be.revertedWithCustomError(
                SemaphoreVotingContract,
                "Semaphore__PollHasAlreadyBeenStarted"
            )
        })
    })

    describe("# startPoll", () => {
        it("Should start a poll", async () => {
            const { SemaphoreVotingContract, coordinator } = await loadFixture(deploySemaphoreVotingFixture)

            const pollId = 0
            await SemaphoreVotingContract.createPoll(pollId, coordinator.address)

            const transaction = await SemaphoreVotingContract.startPoll(pollId, 0)

            await expect(transaction).to.emit(SemaphoreVotingContract, "PollStarted")
        })

        it("Should not start a poll that has already been started", async () => {
            const { SemaphoreVotingContract, coordinator } = await loadFixture(deploySemaphoreVotingFixture)

            const pollId = 0
            await SemaphoreVotingContract.createPoll(pollId, coordinator.address)
            await SemaphoreVotingContract.startPoll(pollId, 0)

            const transaction = SemaphoreVotingContract.startPoll(pollId, 0)

            await expect(transaction).to.be.revertedWithCustomError(
                SemaphoreVotingContract,
                "Semaphore__PollHasAlreadyBeenStarted"
            )
        })
    })

    describe("# castVote", () => {
        it("Should allow a voter to cast a vote", async () => {
            const { SemaphoreVotingContract, coordinator, identity, vote, proof } =
                await loadFixture(deploySemaphoreVotingFixture)

            const pollId = 0
            await SemaphoreVotingContract.createPoll(pollId, coordinator.address)
            await SemaphoreVotingContract.addVoter(pollId, identity.commitment)
            await SemaphoreVotingContract.startPoll(pollId, 0)

            const transaction = await SemaphoreVotingContract.castVote(vote, proof.nullifier, pollId, proof.proof)

            await expect(transaction).to.emit(SemaphoreVotingContract, "VoteAdded")
        })

        it("Should not allow a voter to cast a vote twice", async () => {
            const { SemaphoreVotingContract, coordinator, identity, vote, proof } =
                await loadFixture(deploySemaphoreVotingFixture)

            const pollId = 0
            await SemaphoreVotingContract.createPoll(pollId, coordinator.address)
            await SemaphoreVotingContract.addVoter(pollId, identity.commitment)
            await SemaphoreVotingContract.startPoll(pollId, 0)
            await SemaphoreVotingContract.castVote(vote, proof.nullifier, pollId, proof.proof)

            const transaction = SemaphoreVotingContract.castVote(vote, proof.nullifier, pollId, proof.proof)

            await expect(transaction).to.be.revertedWithCustomError(
                SemaphoreVotingContract,
                "Semaphore__YouAreUsingTheSameNullifierTwice"
            )
        })

        it("Should not allow a voter to cast a vote in a poll that is not ongoing", async () => {
            const { SemaphoreVotingContract, coordinator, identity, vote, proof } =
                await loadFixture(deploySemaphoreVotingFixture)

            const pollId = 0
            await SemaphoreVotingContract.createPoll(pollId, coordinator.address)
            await SemaphoreVotingContract.addVoter(pollId, identity.commitment)

            const transaction = SemaphoreVotingContract.castVote(vote, proof.nullifier, pollId, proof.proof)

            await expect(transaction).to.be.revertedWithCustomError(SemaphoreVoting, "Semaphore__PollIsNotOngoing")
        })
    })

    describe("# endPoll", () => {
        it("Should allow a coordinator to end a poll", async () => {
            const { SemaphoreVotingContract, coordinator } = await loadFixture(deploySemaphoreVotingFixture)

            const pollId = 0
            await SemaphoreVotingContract.createPoll(pollId, coordinator.address)
            await SemaphoreVotingContract.startPoll(pollId, 0)

            const transaction = await SemaphoreVotingContract.endPoll(pollId, 0)

            await expect(transaction).to.emit(SemaphoreVotingContract, "PollEnded")
        })

        it("Should not allow a coordinator to end a poll that is not ongoing", async () => {
            const { SemaphoreVotingContract, coordinator } = await loadFixture(deploySemaphoreVotingFixture)

            const pollId = 0
            await SemaphoreVotingContract.createPoll(pollId, coordinator.address)

            const transaction = SemaphoreVotingContract.endPoll(pollId, 0)

            await expect(transaction).to.be.revertedWithCustomError(
                SemaphoreVotingContract,
                "Semaphore__PollIsNotOngoing"
            )
        })
    })
})
