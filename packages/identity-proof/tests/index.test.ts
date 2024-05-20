import { derivePublicKey } from "@zk-kit/eddsa-poseidon"
import { getCurveFromName } from "ffjavascript"
import { decodeBytes32String, toBeHex } from "ethers"
import { poseidon2 } from "poseidon-lite"
import generate from "../src/generate"
import { IdentityProof } from "../src/types"
import verify from "../src/verify"

describe("IdentityProof", () => {
    const privateKey = Buffer.from("secret")
    const scope = "scope"

    let fullProof: IdentityProof
    let curve: any

    beforeAll(async () => {
        curve = await getCurveFromName("bn128")
        fullProof = await generate(privateKey, scope)
    }, 10_000)

    afterAll(async () => {
        await curve.terminate()
    })

    describe("# generate", () => {
        it("Should generate an Identity proof", async () => {
            const publicKey = derivePublicKey(privateKey)

            const commitment = poseidon2(publicKey)

            expect(fullProof.proof).toHaveLength(8)
            expect(decodeBytes32String(toBeHex(fullProof.scope, 32))).toBe(scope.toString())
            expect(fullProof.commitment).toBe(commitment.toString())
        })
    })

    describe("# verify", () => {
        it("Should verify a valid Identity proof", async () => {
            const response = await verify(fullProof)

            expect(response).toBe(true)
        })

        it("Should verify an invalid Identity proof", async () => {
            fullProof.commitment = "3"

            const response = await verify(fullProof)

            expect(response).toBe(false)
        })
    })
})
