import { readdirSync, rmSync } from "node:fs"

const folderName = "apps"

const gitIgnored = ["node_modules", "dist"]

async function main() {
    const folders = readdirSync(folderName, { withFileTypes: true })
        .filter((file) => file.isDirectory())
        .map((dir) => dir.name)

    folders.map((app) => gitIgnored.map((f) => rmSync(`${folderName}/${app}/${f}`, { recursive: true, force: true })))
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
