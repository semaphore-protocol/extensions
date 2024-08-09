import { expect } from "chai"
import { ethers, run } from "hardhat"
import { Signer } from "ethers"
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers"
import { Group, Identity, generateProof } from "@semaphore-protocol/core"
// @ts-ignore
import { SemaphoreVoting } from "../typechain-types"

describe("SemaphoreVoting", () => {
    async function deploySemaphoreVotingFixture() {
        const { semaphore } = await run("deploy:semaphore", {
            logs: false
        })

        const semaphoreVoting = await run("deploy:semaphore-voting", {
            logs: false,
            semaphore: await semaphore.getAddress()
        })

        const semaphoreContract = semaphore

        const SemaphoreVotingContract: SemaphoreVoting = semaphoreVoting

        const accounts = await run("accounts", { logs: false })
        const accountAddresses = await Promise.all(accounts.map((signer: Signer) => signer.getAddress()))

        const coordinator = accounts[0]
        const voter = accounts[1]
        const identity = new Identity()
        const group = new Group()
        group.addMember(identity.commitment)
        const vote = ethers.keccak256(ethers.toUtf8Bytes("vote"))
        const proof = await generateProof(identity, group, vote, 0)

        return {
            SemaphoreVotingContract,
            coordinator,
            voter,
            identity,
            group,
            vote,
            proof,
            accountAddresses,
            semaphoreContract
        }
    }

    describe("# createPoll", () => {
        it("Should create a poll", async () => {
            const { SemaphoreVotingContract, coordinator } = await loadFixture(deploySemaphoreVotingFixture)

            const pollId = 0
            const transaction = await SemaphoreVotingContract.createPoll(coordinator.address)

            await expect(transaction)
                .to.emit(SemaphoreVotingContract, "PollCreated")
                .withArgs(pollId, coordinator.address)
        })
    })

    describe("# addVoter", () => {
        it("Should add a voter to a poll", async () => {
            const { SemaphoreVotingContract, coordinator, identity, group, semaphoreContract } =
                await loadFixture(deploySemaphoreVotingFixture)

            const pollId = 0
            await SemaphoreVotingContract.createPoll(coordinator.address)

            const transaction = await SemaphoreVotingContract.addVoter(pollId, identity.commitment)

            await expect(transaction)
                .to.emit(semaphoreContract, "MemberAdded")
                .withArgs(pollId, 0, identity.commitment, group.root)
        })

        it("Should not add a voter to a poll that has already been started", async () => {
            const { SemaphoreVotingContract, coordinator, identity } = await loadFixture(deploySemaphoreVotingFixture)

            const pollId = 0
            await SemaphoreVotingContract.createPoll(coordinator.address)
            await SemaphoreVotingContract.startPoll(pollId, 0)

            const transaction = SemaphoreVotingContract.addVoter(pollId, identity.commitment)

            await expect(transaction).to.be.revertedWithCustomError(
                SemaphoreVotingContract,
                "SemaphoreVoting__PollHasAlreadyBeenStarted"
            )
        })

        it("Should not add a voter to a poll if the coordinator is not correct", async () => {
            const { SemaphoreVotingContract, coordinator, identity, voter } =
                await loadFixture(deploySemaphoreVotingFixture)

            const pollId = 0
            await SemaphoreVotingContract.createPoll(coordinator.address)

            const transaction = SemaphoreVotingContract.connect(voter).addVoter(pollId, identity.commitment)

            await expect(transaction).to.be.revertedWithCustomError(
                SemaphoreVotingContract,
                "SemaphoreVoting__CallerIsNotThePollCoordinator"
            )
        })
    })

    describe("# startPoll", () => {
        it("Should start a poll", async () => {
            const { SemaphoreVotingContract, coordinator } = await loadFixture(deploySemaphoreVotingFixture)

            const pollId = 0
            await SemaphoreVotingContract.createPoll(coordinator.address)

            const transaction = await SemaphoreVotingContract.startPoll(pollId, 0)

            await expect(transaction).to.emit(SemaphoreVotingContract, "PollStarted")
        })

        it("Should not start a poll that has already been started", async () => {
            const { SemaphoreVotingContract, coordinator } = await loadFixture(deploySemaphoreVotingFixture)

            const pollId = 0
            await SemaphoreVotingContract.createPoll(coordinator.address)
            await SemaphoreVotingContract.startPoll(pollId, 0)

            const transaction = SemaphoreVotingContract.startPoll(pollId, 0)

            await expect(transaction).to.be.revertedWithCustomError(
                SemaphoreVotingContract,
                "SemaphoreVoting__PollHasAlreadyBeenStarted"
            )
        })

        it("Should not start a poll if the caller is not poll coordinator", async () => {
            const { SemaphoreVotingContract, voter } = await loadFixture(deploySemaphoreVotingFixture)

            const pollId = 0
            await SemaphoreVotingContract.createPoll(voter.address)
            const transaction = SemaphoreVotingContract.startPoll(pollId, 0)

            await expect(transaction).to.be.revertedWithCustomError(
                SemaphoreVotingContract,
                "SemaphoreVoting__CallerIsNotThePollCoordinator"
            )
        })
    })

    describe("# castVote", () => {
        it("Should allow a voter to cast a vote", async () => {
            const { SemaphoreVotingContract, coordinator, identity, vote, proof, group } =
                await loadFixture(deploySemaphoreVotingFixture)

            const pollId = 0
            await SemaphoreVotingContract.createPoll(coordinator.address)
            await SemaphoreVotingContract.addVoter(pollId, identity.commitment)
            await SemaphoreVotingContract.startPoll(pollId, 0)

            const transaction = await SemaphoreVotingContract.castVote(
                vote,
                pollId,
                proof.merkleTreeDepth,
                proof.nullifier,
                group.root,
                proof.points
            )

            await expect(transaction).to.emit(SemaphoreVotingContract, "VoteAdded")
        })

        it("Should not allow a voter to cast a vote twice", async () => {
            const { SemaphoreVotingContract, coordinator, identity, vote, proof, group, semaphoreContract } =
                await loadFixture(deploySemaphoreVotingFixture)

            const pollId = 0
            await SemaphoreVotingContract.createPoll(coordinator.address)
            await SemaphoreVotingContract.addVoter(pollId, identity.commitment)
            await SemaphoreVotingContract.startPoll(pollId, 0)
            await SemaphoreVotingContract.castVote(
                vote,
                pollId,
                proof.merkleTreeDepth,
                proof.nullifier,
                group.root,
                proof.points
            )

            const transaction = SemaphoreVotingContract.castVote(
                vote,
                pollId,
                group.depth,
                proof.nullifier,
                group.root,
                proof.points
            )

            await expect(transaction).to.be.revertedWithCustomError(
                semaphoreContract,
                "Semaphore__YouAreUsingTheSameNullifierTwice"
            )
        })

        it("Should not allow a voter to cast a vote in a poll that is not ongoing", async () => {
            const { SemaphoreVotingContract, coordinator, identity, vote, proof, group } =
                await loadFixture(deploySemaphoreVotingFixture)

            const pollId = 0
            await SemaphoreVotingContract.createPoll(coordinator.address)
            await SemaphoreVotingContract.addVoter(pollId, identity.commitment)

            const transaction = SemaphoreVotingContract.castVote(
                vote,
                pollId,
                group.depth,
                proof.nullifier,
                group.root,
                proof.points
            )

            await expect(transaction).to.be.revertedWithCustomError(
                SemaphoreVotingContract,
                "SemaphoreVoting__PollIsNotOngoing"
            )
        })
    })

    describe("# endPoll", () => {
        it("Should allow a coordinator to end a poll", async () => {
            const { SemaphoreVotingContract, coordinator } = await loadFixture(deploySemaphoreVotingFixture)

            const pollId = 0
            await SemaphoreVotingContract.createPoll(coordinator.address)
            await SemaphoreVotingContract.startPoll(pollId, 0)

            const transaction = await SemaphoreVotingContract.endPoll(pollId, 0)

            await expect(transaction).to.emit(SemaphoreVotingContract, "PollEnded")
        })

        it("Should not allow a coordinator to end a poll that is not ongoing", async () => {
            const { SemaphoreVotingContract, coordinator } = await loadFixture(deploySemaphoreVotingFixture)

            const pollId = 0
            await SemaphoreVotingContract.createPoll(coordinator.address)

            const transaction = SemaphoreVotingContract.endPoll(pollId, 0)

            await expect(transaction).to.be.revertedWithCustomError(
                SemaphoreVotingContract,
                "SemaphoreVoting__PollIsNotOngoing"
            )
        })

        it("Should not end a poll if the coordinator is not correct", async () => {
            const { SemaphoreVotingContract, coordinator, voter } = await loadFixture(deploySemaphoreVotingFixture)

            const pollId = 0
            await SemaphoreVotingContract.createPoll(coordinator.address)
            await SemaphoreVotingContract.startPoll(pollId, 0)

            const transaction = SemaphoreVotingContract.connect(voter).endPoll(pollId, 0)

            await expect(transaction).to.be.revertedWithCustomError(
                SemaphoreVotingContract,
                "SemaphoreVoting__CallerIsNotThePollCoordinator"
            )
        })
    })
})
