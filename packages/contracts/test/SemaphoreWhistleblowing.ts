import { expect } from "chai"
import { ethers, run } from "hardhat"
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers"
import { Group, Identity, generateProof } from "@semaphore-protocol/core"
import { Signer } from "ethers"
import { BigNumber } from "@ethersproject/bignumber"
import { SemaphoreWhistleblowing } from "../typechain-types"

describe("SemaphoreWhistleblowing", () => {
    async function deploySemaphoreWhistleblowingFixture() {
        const semaphoreWhistleblowing = await run("deploy:semaphore-whistleblowing", {
            logs: false
        })

        const semaphoreWhistleblowingContract: SemaphoreWhistleblowing = semaphoreWhistleblowing

        const accounts = await run("accounts", { logs: false })
        const accountAddresses = await Promise.all(accounts.map((signer: Signer) => signer.getAddress()))

        const coordinator = accounts[0]
        const whistleblower = accounts[1]
        const identity = new Identity()
        const groupId = BigNumber.from(0)
        const group = new Group(groupId)
        group.addMember(identity.commitment)
        const leak = ethers.keccak256(ethers.toUtf8Bytes("leak"))
        const proof = await generateProof(identity, group, 0, leak)

        return {
            semaphoreWhistleblowingContract,
            coordinator,
            whistleblower,
            identity,
            group,
            leak,
            proof,
            accountAddresses
        }
    }

    describe("# createEntity", () => {
        it("Should create an entity", async () => {
            const { semaphoreWhistleblowingContract, coordinator } = await loadFixture(
                deploySemaphoreWhistleblowingFixture
            )

            const entityId = 0
            const transaction = await semaphoreWhistleblowingContract.createEntity(entityId, coordinator.address)

            await expect(transaction)
                .to.emit(semaphoreWhistleblowingContract, "EntityCreated")
                .withArgs(entityId, coordinator.address)
        })
    })

    describe("# addWhistleblower", () => {
        it("Should add a whistleblower to an entity", async () => {
            const { semaphoreWhistleblowingContract, coordinator, identity } = await loadFixture(
                deploySemaphoreWhistleblowingFixture
            )

            const entityId = 0
            await semaphoreWhistleblowingContract.createEntity(entityId, coordinator.address)

            const transaction = await semaphoreWhistleblowingContract.addWhistleblower(entityId, identity.commitment)

            await expect(transaction).to.emit(semaphoreWhistleblowingContract, "MemberAdded")
        })

        it("Should not add a whistleblower to an entity if the caller is not the editor", async () => {
            const { semaphoreWhistleblowingContract, coordinator, whistleblower, identity } = await loadFixture(
                deploySemaphoreWhistleblowingFixture
            )

            const entityId = 0
            await semaphoreWhistleblowingContract.createEntity(entityId, coordinator.address)

            const transaction = semaphoreWhistleblowingContract
                .connect(whistleblower)
                .addWhistleblower(entityId, identity.commitment)

            await expect(transaction).to.be.revertedWithCustomError(
                semaphoreWhistleblowingContract,
                "Semaphore__CallerIsNotTheEditor"
            )
        })
    })

    describe("# removeWhistleblower", () => {
        it("Should remove a whistleblower from an entity", async () => {
            const { semaphoreWhistleblowingContract, coordinator, identity } = await loadFixture(
                deploySemaphoreWhistleblowingFixture
            )

            const entityId = 0
            await semaphoreWhistleblowingContract.createEntity(entityId, coordinator.address)
            await semaphoreWhistleblowingContract.addWhistleblower(entityId, identity.commitment)

            const transaction = await semaphoreWhistleblowingContract.removeWhistleblower(
                entityId,
                identity.commitment,
                []
            )

            await expect(transaction).to.emit(semaphoreWhistleblowingContract, "MemberRemoved")
        })

        it("Should not remove a whistleblower from an entity if the caller is not the editor", async () => {
            const { semaphoreWhistleblowingContract, coordinator, whistleblower, identity } = await loadFixture(
                deploySemaphoreWhistleblowingFixture
            )

            const entityId = 0
            await semaphoreWhistleblowingContract.createEntity(entityId, coordinator.address)
            await semaphoreWhistleblowingContract.addWhistleblower(entityId, identity.commitment)

            const transaction = semaphoreWhistleblowingContract
                .connect(whistleblower)
                .removeWhistleblower(entityId, identity.commitment, [])

            await expect(transaction).to.be.revertedWithCustomError(
                semaphoreWhistleblowingContract,
                "Semaphore__CallerIsNotTheEditor"
            )
        })
    })

    describe("# publishLeak", () => {
        it("Should allow a whistleblower to publish a leak", async () => {
            const { semaphoreWhistleblowingContract, coordinator, identity, leak, proof } = await loadFixture(
                deploySemaphoreWhistleblowingFixture
            )

            const entityId = 0
            await semaphoreWhistleblowingContract.createEntity(entityId, coordinator.address)
            await semaphoreWhistleblowingContract.addWhistleblower(entityId, identity.commitment)

            const transaction = await semaphoreWhistleblowingContract.publishLeak(
                leak,
                proof.nullifier,
                entityId,
                proof.proof
            )

            await expect(transaction).to.emit(semaphoreWhistleblowingContract, "LeakPublished").withArgs(entityId, leak)
        })

        it("Should not allow a whistleblower to publish a leak with an invalid proof", async () => {
            const { semaphoreWhistleblowingContract, coordinator, identity, leak, proof } = await loadFixture(
                deploySemaphoreWhistleblowingFixture
            )

            const entityId = 0
            await semaphoreWhistleblowingContract.createEntity(entityId, coordinator.address)
            await semaphoreWhistleblowingContract.addWhistleblower(entityId, identity.commitment)

            const invalidProof = proof.map((p) => p.add(1))

            const transaction = semaphoreWhistleblowingContract.publishLeak(
                leak,
                proof.nullifier,
                entityId,
                invalidProof
            )

            await expect(transaction).to.be.revertedWith("Invalid proof")
        })
    })
})
