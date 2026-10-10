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

Removed fields:

- `devDependencies`, even though npm documents it, because installing the
  published package does not install them.
- `overrides`, `workspaces`, `devEngines`, `packageManager`, and
  `packageExtensions`, because npm, Corepack, Yarn, and pnpm only read them in
  the project root.
- Every other field, such as configuration for linters and test runners.

Each field's reason and source are listed in
[src/documentedFields.mts](src/documentedFields.mts). The rules apply in this
order:

1. A field given with `--keep` is kept.
2. A field listed as removed, such as `devDependencies`, is removed.
3. A field listed as kept is kept.
4. Any other field is removed.

A field that is valid in package.json is not necessarily kept. A field is kept
only when consumers, npm, or other tools read it from the installed package.

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
npm test
```

Biome checks formatting, imports, and lint rules for TypeScript and JSON files.
Run `npm run lint -- --write` to apply formatting and safe fixes.
TypeScript 7 checks types and generates the JavaScript build and declarations
when running `npm run build`.

### Field policy updates

`schemastore/package-json-keys.json` is a snapshot of the top-level properties
in the [SchemaStore package.json schema](https://github.com/SchemaStore/schemastore/blob/master/src/schemas/json/package.json).
A test requires a policy in `src/documentedFields.mts` for every key in the
snapshot. The tool itself never fetches the schema.

A scheduled workflow runs `node scripts/check-schemastore.mjs` every Monday and
fails when SchemaStore has keys that the snapshot does not. To handle it, add a
policy for each new key and run `node scripts/check-schemastore.mjs --update`.

Git hooks are not installed automatically. Lint, formatting, and tests run in CI.
If an existing checkout uses the old hooks, remove the setting with
`git config --local --unset core.hooksPath` when it points to `.githooks`.

## LICENSE

The cleanup-package-json project is licensed under the terms of the Apache 2.0 License.
