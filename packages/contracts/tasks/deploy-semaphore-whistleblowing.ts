import { task, types } from "hardhat/config"

task("deploy-semaphore-whistleblowing-v4", "Deploy a  Semaphore whistleblowing contract")
    .addOptionalParam("semaphore", "Semaphore contract address", undefined, types.string)
    .addOptionalParam("logs", "Print the logs", true, types.boolean)
    .setAction(async ({ logs, semaphore: semaphoreAddress }, { ethers, run }) => {
        if (!semaphoreAddress) {
            const { semaphore } = await run("deploy:semaphore", {
                logs
            })

            semaphoreAddress = await semaphore.getAddress()
        }

        const SemaphoreWhistleblowingFactory = await ethers.getContractFactory("SemaphoreWhistleblowing ")

        const SemaphoreWhistleblowingContract = await SemaphoreWhistleblowingFactory.deploy(semaphoreAddress)

        if (logs) {
            console.info(
                `Semaphore Voting contract has been deployed to: ${await SemaphoreWhistleblowingContract.getAddress()}`
            )
        }

        return SemaphoreWhistleblowingContract
    })
