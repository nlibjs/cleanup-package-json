# cleanup-package-json

[![Test](https://github.com/nlibjs/cleanup-package-json/actions/workflows/test.yml/badge.svg)](https://github.com/nlibjs/cleanup-package-json/actions/workflows/test.yml)
[![codecov](https://codecov.io/gh/nlibjs/cleanup-package-json/branch/main/graph/badge.svg?token=YJG86MybgN)](https://codecov.io/gh/nlibjs/cleanup-package-json)

A command line tool to cleanup package.json before publish. It will keep the fields listed in the [documentation](https://docs.npmjs.com/configuring-npm/package-json.html) and remove the rest.

## Usage

Requires Node.js 22.20.0 or later.

```
npx @nlib/cleanup-package-json --file package.json
```

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
