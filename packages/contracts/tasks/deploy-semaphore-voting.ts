import { task, types } from "hardhat/config"

task("deploy:semaphore-voting", "Deploy a  Semaphore Voting contract")
    .addOptionalParam("semaphore", "Semaphore contract address", undefined, types.string)
    .addOptionalParam("logs", "Print the logs", true, types.boolean)
    .setAction(async ({ logs, semaphore: semaphoreAddress }, { ethers, run }) => {
        if (!semaphoreAddress) {
            const { semaphore } = await run("deploy:semaphore", {
                logs
            })

            semaphoreAddress = await semaphore.getAddress()
        }

        const SempahoreVotingFactory = await ethers.getContractFactory("SemaphoreVoting")

        const SemaphoreVotingContract = await SempahoreVotingFactory.deploy(semaphoreAddress)

        if (logs) {
            console.info(
                `Semaphore Voting contract has been deployed to: ${await SemaphoreVotingContract.getAddress()}`
            )
        }

        return SemaphoreVotingContract
    })
