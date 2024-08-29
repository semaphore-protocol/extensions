import { readFileSync, writeFileSync } from "node:fs"

async function main() {
    const packageName = process.argv[2]
    const projectDirectory =
        packageName === "contracts" ? `packages/${packageName}/contracts` : `packages/${packageName}`

    const filePath = `${projectDirectory}/package.json`

    const content = JSON.parse(readFileSync(filePath, "utf8"))

    if (content.stableVersion) {
        delete content.stableVersion
    }

    writeFileSync(filePath, JSON.stringify(content, null, 4), "utf8")
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
