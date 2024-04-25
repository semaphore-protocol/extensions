<p align="center">
    <h1 align="center">
        Semaphore Extensions
    </h1>
    <p align="center">Semaphore Tools and Extensions Monorepo.</p>
</p>

<p align="center">
    <a href="https://github.com/semaphore-protocol" target="_blank">
        <img src="https://img.shields.io/badge/project-Semaphore-blue.svg?style=flat-square">
    </a>
    <a href="https://github.com/semaphore-protocol/extensions/blob/main/LICENSE">
        <img alt="Github license" src="https://img.shields.io/github/license/semaphore-protocol/extensions">
    </a>
    <a href="https://github.com/privacy-scaling-explorations/zk-kit/actions?query=workflow%3Aproduction">
        <img alt="GitHub Workflow test" src="https://img.shields.io/github/actions/workflow/status/semaphore-protocol/extensions/production.yml?branch=main&style=flat-square&logo=github&label=test">
    </a>
    <a href="https://coveralls.io/github/privacy-scaling-explorations/zk-kit">
        <img alt="Coveralls" src="https://img.shields.io/coverallsCoverage/github/semaphore-protocol/extensions?style=flat-square&logo=coveralls&label=coverage%20(ts)">
    </a>
    <a href="https://eslint.org/">
        <img alt="Linter eslint" src="https://img.shields.io/badge/linter-eslint-8080f2?style=flat-square&logo=eslint">
    </a>
    <a href="https://prettier.io/">
        <img alt="Code style prettier" src="https://img.shields.io/badge/code%20style-prettier-f8bc45?style=flat-square&logo=prettier">
    </a>
    <a href="http://commitizen.github.io/cz-cli/">
        <img alt="Commitizen friendly" src="https://img.shields.io/badge/commitizen-friendly-586D76?style=flat-square">
    </a>
</p>

<div align="center">
    <h4>
        <a href="/CONTRIBUTING.md">
            👥 Contributing
        </a>
        <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
        <a href="/CODE_OF_CONDUCT.md">
            🤝 Code of conduct
        </a>
        <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
        <a href="https://github.com/semaphore-protocol/extensions/issues/new/choose">
            🔎 Issues
        </a>
        <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
        <a href="https://semaphore.pse.dev/discord">
            🗣️ Chat &amp; Support
        </a>
    </h4>
</div>

| Semaphore Extensions is a set of applications, tools and libraries that can be used with the Semaphore protocol. |
| ---------------------------------------------------------------------------------------------------------------- |

♚ [Yarn workspaces](https://yarnpkg.com/features/workspaces): minimal monorepo package management (`yarn`, `yarn build`, `yarn docs`)\
♛ [Conventional Commits](https://www.conventionalcommits.org): human and machine readable meaning to commit messages (`yarn commit`)\
♜ [Jest](https://jestjs.io/): tests and test coverage for all libraries (`yarn test:libraries`)\
♞ [ESLint](https://eslint.org/), [Prettier](https://prettier.io/): code quality and formatting (`yarn prettier` & `yarn lint`)\
♝ [Typedocs](https://typedoc.org/): documentation generator for TypeScript (`yarn docs`)\
♟ [Github actions](https://github.com/features/actions): software workflows for automatic testing, documentation deploy and code quality checks

## 📦 Packages

<table>
    <th>Package</th>
    <th>Version</th>
    <th>Downloads</th>
    <tbody>
        <tr>
            <td>
                <a href="https://github.com/semaphore-protocol/extensions/tree/main/packages/heyauthn">
                    @semaphore-extensions/heyauthn
                </a>
            </td>
            <td>
                <!-- NPM version -->
                <a href="https://www.npmjs.com/package/@semaphore-extensions/heyauthn">
                    <img alt="NPM Version" src="https://img.shields.io/npm/v/%40semaphore-extensions%2Fheyauthn">
                </a>
            </td>
            <td>
                <!-- Downloads -->
                <a href="https://npmjs.org/package/@semaphore-extensions/heyauthn">
                    <img alt="NPM Downloads" src="https://img.shields.io/npm/dm/%40semaphore-extensions%2Fheyauthn">
                </a>
            </td>
        </tr>
    <tbody>
</table>

## 🛠 Install

Clone this repository:

```bash
git clone https://github.com/semaphore-protocol/extensions.git
```

and install the dependencies:

```bash
cd extensions && yarn
```

## 📜 Usage

### Code quality and formatting

Run [ESLint](https://eslint.org/) to analyze the code and catch bugs:

```bash
yarn lint
```

Run [Prettier](https://prettier.io/) to check formatting rules:

```bash
yarn format
```

or to automatically format the code:

```bash
yarn format:write
```

### Conventional commits

Semaphore uses [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/). A [command line utility](https://github.com/commitizen/cz-cli) to commit using the correct syntax can be used by running:

```bash
yarn commit
```

It will also automatically check that the modified files comply with ESLint and Prettier rules.

### Testing

Test the code:

```bash
yarn test
```

### Build

Build all the packages:

```bash
yarn build
```

A `dist` folder will be created inside each JavaScript package.

### Documentation

Generate a documentation website for each package:

```bash
yarn docs
```

The output will be placed on the `docs` folder.

## Releases

Steps:

1. Bump a new version with:

```bash
yarn version:bump <version>
# e.g. yarn version:bump 2.0.0
```

This step creates a commit and a git tag.

2. Push the changes to main:

```bash
git push origin main
```

3. Push the new git tag:

```bash
git push origin <version>
# e.g. git push origin 2.0.0
```

After pushing the new git tag, a workflow will be triggered and will publish the Bandada packages on [npm](https://www.npmjs.com/) and release a new version on Github with its changelogs automatically.
