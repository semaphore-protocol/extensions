pragma circom 2.1.5;

include "babyjub.circom";
include "poseidon.circom";
include "comparators.circom";

// This circuit can be used to prove the possession of a Semaphore private key
// without revealing the private key itself. It utilizes
// the {@link https://eips.ethereum.org/EIPS/eip-2494|Baby Jubjub} elliptic curve, the Poseidon hash function which a highly efficient
// and secure hash function suited for zero-knowledge proof contexts.
// A scope value can be used to define a nullifier to prevent the same
// proof from being re-used twice.
template IdentityProof() {
    // The circuit takes two inputs: the private key and an additional scope parameter.
    signal input secret;
    signal input scope;

    signal output commitment;

    // The secret scalar must be in the prime subgroup order 'l'.
    var l = 2736030358979909402780800718157159386076813972158567259200215660948447373041;

    component isLessThan = LessThan(251);
    isLessThan.in <== [secret, l];
    isLessThan.out === 1;

    var Ax, Ay;

    // Get the two Baby Jubjub points using the private key.
    (Ax, Ay) = BabyPbk()(secret);

    // It applies the Poseidon hash function to the to Baby Jubjub points to produce the commitment.
    commitment <== Poseidon(2)([Ax, Ay]);

    // Dummy constraint to prevent compiler from optimizing it.
    signal dummySquare <== scope * scope;
}
