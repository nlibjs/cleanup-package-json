# cleanup-package-json

[![Test](https://github.com/nlibjs/cleanup-package-json/actions/workflows/test.yml/badge.svg)](https://github.com/nlibjs/cleanup-package-json/actions/workflows/test.yml)
[![codecov](https://codecov.io/gh/nlibjs/cleanup-package-json/branch/main/graph/badge.svg?token=YJG86MybgN)](https://codecov.io/gh/nlibjs/cleanup-package-json)

A command line tool to cleanup package.json before publish. It keeps the fields
used by consumers of the published package and removes the rest, such as
configuration for linters and test runners.

Kept fields:

- Fields in the [npm documentation](https://docs.npmjs.com/cli/configuring-npm/package-json),
  including `bundleDependencies`, `libc`, and `gypfile`.
- Fields that Node.js reads: `type`, `imports`, and `exports`.
- Fields that TypeScript reads: `types`, `typings`, and `typesVersions`.
- Fields that bundlers read: `module` and `sideEffects`.

`devDependencies` is removed even though npm documents it, because installing
the published package does not use it.

## Usage

Requires Node.js 22.20.0 or later.

The command overwrites the file given with `--file`. Run it on the copy that you
publish, for example in CI right before `npm publish`, not on the file you edit.

```sh
npx @nlib/cleanup-package-json --file package.json
```

### Keep extra fields

`--keep` keeps the given fields even when they would be removed otherwise,
including `devDependencies`.

```sh
npx @nlib/cleanup-package-json --file package.json --keep devDependencies customField
```

### Preview the result

`--dry-run` leaves the file unchanged. It prints the keys to remove to stderr
and the cleaned JSON to stdout. The preview uses the same rules as a real run.

```sh
npx @nlib/cleanup-package-json --file package.json --dry-run
```

The command exits with a non-zero code without changing the file when the file
is not valid JSON or its root is not an object.

## Development

```sh
npm ci
npm run lint
npm run format:check
npm test
```

Git hooks are not installed automatically. Lint, formatting, and tests run in CI.
If an existing checkout uses the old hooks, remove the setting with
`git config --local --unset core.hooksPath` when it points to `.githooks`.

## LICENSE

The cleanup-package-json project is licensed under the terms of the Apache 2.0 License.
