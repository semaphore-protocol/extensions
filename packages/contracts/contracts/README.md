<p align="center">
    <h1 align="center">
        Semaphore Extension Contracts
    </h1>
    <p align="center">Solidity contracts to enhance Semaphore with extra features and customization</p>
</p>
<p align="center">
    <a href="https://github.com/semaphore-protocol">
        <img src="https://img.shields.io/badge/project-Semaphore-blue.svg?style=flat-square">
    </a>
    <a href="https://github.com/semaphore-protocol/extensions/blob/main/packages/contracts/contracts/LICENSE">
        <img alt="NPM license" src="https://img.shields.io/npm/l/%40semaphore-extensions%2Fcontracts?style=flat-square">
    </a>
    <a href="https://www.npmjs.com/package/@semaphore-extensions/contracts">
        <img alt="NPM version" src="https://img.shields.io/npm/v/@semaphore-extensions/contracts?style=flat-square" />
    </a>
    <a href="https://npmjs.org/package/@semaphore-extensions/contracts">
        <img alt="Downloads" src="https://img.shields.io/npm/dm/@semaphore-extensions/contracts.svg?style=flat-square" />
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

or yarn:

```bash
yarn add @semaphore-extension/contracts
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

1. Copy the `.env.example` file as `.env`.

```bash
cp .env.example .env
```

2. Add your environment variables.

> **Note**  
> You should at least set a valid Ethereum URL (e.g. Infura) and a private key with some ethers.

### Deploy contracts

To deploy the `SemaphoreVoting.sol`:

```bash
yarn deploy:semaphore-voting
```

To deploy the `SemaphoreWhistleblowing.sol`:

```bash
yarn deploy:semaphore-whistleblowing
```
