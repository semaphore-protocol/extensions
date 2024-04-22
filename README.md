# Semaphore Extensions

Semaphore Tools and Extensions Monorepo.

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
