import { NumericString } from "snarkjs"
import { PackedGroth16Proof } from "@zk-kit/utils"

export type IdentityProof = {
    commitment: NumericString
    scope: NumericString
    proof: PackedGroth16Proof
}
