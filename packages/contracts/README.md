<p align="center">
    <h1 align="center">
        Semaphore Extension Contracts
    </h1>
    <p align="center">Extension contracts to manage Voting and whistleBlowing</p>
</p>

<p align="center">
    <a href="https://github.com/semaphore-protocol">
        <img src="https://img.shields.io/badge/project-Semaphore-blue.svg?style=flat-square">
    </a>
    <a href="https://github.com/semaphore-protocol/extensions/blob/main/packages/heyauthn/LICENSE">
        <img alt="NPM License" src="https://img.shields.io/npm/l/%40semaphore-extensions%2contracts">
    </a>
    <a href="https://www.npmjs.com/package/@semaphore-extensions/contracts">
        <img alt="NPM Version" src="https://img.shields.io/npm/v/%40semaphore-extensions%2Fheyauthn">
    </a>
    <a href="https://npmjs.org/package/@semaphore-extensions/contracts">
        <img alt="NPM Downloads" src="https://img.shields.io/npm/dm/%40semaphore-extensions%2contracts">
    </a>
    <a href="https://semaphore-protocol.github.io/extensions/classes/HeyAuthn.html">
        <img alt="Documentation typedoc" src="https://img.shields.io/badge/docs-typedoc-744C7C?style=flat-square">
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
        <a href="https://github.com/semaphore-protocol/extensions/blob/main/CONTRIBUTING.md">
            👥 Contributing
        </a>
        <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
        <a href="https://github.com/semaphore-protocol/extensions/blob/main/CODE_OF_CONDUCT.md">
            🤝 Code of conduct
        </a>
        <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
        <a href="https://github.com/semaphore-protocol/extensions/contribute">
            🔎 Issues
        </a>
        <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
        <a href="https://semaphore.pse.dev/discord">
            🗣️ Chat &amp; Support
        </a>
    </h4>
</div>

## 🛠 Install

### npm or yarn

Install the `@semaphore-extension/contracts` package with npm:

```bash
npm i @semaphore-extension/contracts
```

## Usage

### Compile contracts

```bash
yarn compile
```

### Test contracts

```bash
yarn test
```

You can also generate a test coverage report:

```bash
yarn test:coverage
```

Or a test gas report:

```bash
yarn test:report-gas
```

### Deploy contracts

1. Copy the `.env.example` file as `.env`.

```bash
cp .env.example .env
```

2. Add your environment variables.

> **Note**  
> You should at least set a valid Ethereum URL (e.g. Infura) and a private key with some ethers.

> **Warning**  
> The group id is a number!

### Code quality and formatting

Run [ESLint](https://eslint.org/) and [solhint](https://github.com/protofire/solhint) to analyze the code and catch bugs:

```bash
yarn lint
```

Run [Prettier](https://prettier.io/) to check formatting rules:

```bash
yarn prettier
```

Or to automatically format the code:

```bash
yarn prettier:write
```
