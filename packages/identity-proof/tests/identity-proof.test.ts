import { WitnessTester } from "circomkit"
import { poseidon2 } from "poseidon-lite"
import { deriveSecretScalar, derivePublicKey } from "@zk-kit/eddsa-poseidon"
import { circomkit } from "./common"

describe("identity-proof", () => {
    let circuit: WitnessTester<["secret", "scope"], ["commitment"]>

    const privateKey = Buffer.from("secret")
    const scope = 2

    const publicKey = derivePublicKey(privateKey)
    const commitment = poseidon2(publicKey)

    const INPUT = {
        secret: deriveSecretScalar(privateKey),
        scope
    }

    const OUTPUT = {
        commitment
    }

    before(async () => {
        circuit = await circomkit.WitnessTester("identity-proof", {
            file: "identity-proof",
            template: "IdentityProof",
            pubs: ["scope"]
        })
    })

    it("Should compute the commitment correctly", async () => {
        await circuit.expectPass(INPUT, OUTPUT)
    })
})
