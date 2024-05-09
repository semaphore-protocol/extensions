import { groth16 } from "snarkjs"
import { unpackGroth16Proof } from "@zk-kit/utils"
import hash from "./hash"
import { IdentityProof } from "./types"
import verificationKey from "./verification-key.json"

/**
 * Verifies that a Identity proof is valid.
 * @param identityProof The Identity zero-knowledge proof.
 * @returns True if the proof is valid, false otherwise.
 */
export default function verify({ commitment, scope, proof }: IdentityProof): Promise<boolean> {
    return groth16.verify(verificationKey, [commitment, hash(scope)], unpackGroth16Proof(proof))
}
