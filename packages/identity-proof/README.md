<p align="center">
    <h1 align="center">
        Semaphore Identity Proof
    </h1>
    <p align="center">A library to prove the ownership of a Semaphore identity without revealing the private key.</p>
</p>

<p align="center">
    <a href="https://github.com/semaphore-protocol">
        <img src="https://img.shields.io/badge/project-Semaphore-blue.svg?style=flat-square">
    </a>
    <a href="https://github.com/semaphore-protocol/extensions/tree/main/packages/identity-proof/LICENSE">
        <img alt="NPM license" src="https://img.shields.io/npm/l/%40semaphore-extensions%identity-proof?style=flat-square">
    </a>
    <a href="https://www.npmjs.com/package/@semaphore-extensions/identity-proof">
        <img alt="NPM version" src="https://img.shields.io/npm/v/@semaphore-extensions/identity-proof?style=flat-square" />
    </a>
    <a href="https://npmjs.org/package/@semaphore-extensions/identity-proof">
        <img alt="Downloads" src="https://img.shields.io/npm/dm/@semaphore-extensions/identity-proof.svg?style=flat-square" />
    </a>
    <a href="https://bundlephobia.com/package/@semaphore-extensions/identity-proof">
        <img alt="npm bundle size (scoped)" src="https://img.shields.io/bundlephobia/minzip/@semaphore-extensions/identity-proof" />
    </a>
    <a href="https://eslint.org/">
        <img alt="Linter eslint" src="https://img.shields.io/badge/linter-eslint-8080f2?style=flat-square&logo=eslint" />
    </a>
    <a href="https://prettier.io/">
        <img alt="Code style prettier" src="https://img.shields.io/badge/code%20style-prettier-f8bc45?style=flat-square&logo=prettier" />
    </a>
</p>

<div align="center">
    <h4>
        <a href="https://appliedzkp.org/telegram">
            🗣️ Chat &amp; Support
        </a>
        <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
        <a href="https://semaphore-protocol.github.io/extensions/modules/_semaphore_extensions_identity_proof.html">
            📘 Docs
        </a>
    </h4>
</div>

| This zero-knowledge library allows you to prove and verify that you have the private key of a Semaphore identity. It will be mainly used on-chain because you can get the same result off-chain using EdDSA signatures with the `@semaphore-protocol/identity` package. It facilitates the demonstration of having an EdDSA hash pre-image while keeping the pre-image value confidential. Additionally, it offers a mechanism to prevent the same proof from being reused. The circuit that forms the foundation of this library is accessible via this [link](https://github.com/semaphore-protocol/extensions/blob/main/packages/identity-proof.circom). |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

> [!WARNING]  
> The Snark artifacts currently used to generate zero-knowledge proofs are the result of an insecure trusted setup, and the library has not yet been audited. Therefore, it is advised not to use it in production.

## 🛠 Install

Install the `@semaphore-extensions/identity-proof` package:

```bash
npm i @semaphore-extensions/identity-proof
```

or yarn:

```bash
yarn add @semaphore-extensions/identity-proof
```

## 📜 Usage

```typescript
import { generate, verify } from "@semaphore-extensions/identity-proof"

// Your private key (secret) associated with your commitment.
const privateKey = "secret"
// A public value used to contextualize the cryptographic proof and calculate the nullifier.
const scope = "scope"

// Generate the proof.
const fullProof = await generate(privateKey, scope)

/*
    nb. commitment and scope are always the same - proof is variable.
{
    commitment: '21756852044673293804725356853298692762259855200429755225624171532449447776732',
    scope: '52191664570483756643537362991541193331102618014473399276861326740461293928448',
    proof: [
        '14987543977537638797613616391807211498102534775759297152458980015937921301475',
        '3399335485250714998192957632691923175498432819155620830553382340417897595836',
        '458847933923791518779258584891719351511628278818450523853640641455008133942',
        '9130558865745328382423837376229933835283742789420937388990076948167771186665',
        '2527867303822223913583586720705858457538165210401589969189198821632271648294',
        '870032122185130505849909299495220614500026484724112145131565329210361970548',
        '7499124546917660821334566902083675362480525785493429715971012094306224236446',
        '4681140599918274218600441523225984097742730174371377925026448119492671129895'
    ]
}

*/
console.log(fullProof)

// If not specified, the Snark artifacts are downloaded automatically.
// You can specify them as follows.

// const fullProof = await generate(privateKey, scope, {
//     wasm: "<your-path>/identity-proof.wasm",
//     zkey: "<your-path>/identity-proof.zkey"
// })

// Verify the proof.
const response = await verify(fullProof)

// true.
console.log(response)
```

## 📈 Benchmarks

Benchmarks were run on an Intel Core i7-1165G7, 16 GB RAM machine.

| Generate proof | Verify proof | Constraints |
| -------------- | ------------ | ----------- |
| `258ms`        | `15ms`       | `1017`      |

```ts
import { generate, verify } from "@semaphore-extensions/identity-proof"

console.time("generate")

const proof = await generate("secret", "scope")

console.timeEnd("generate")

console.time("verify")

console.log(await verify(proof))

console.timeEnd("verify")
```
