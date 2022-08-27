# cleanup-package-json

[![Test](https://github.com/nlibjs/cleanup-package-json/actions/workflows/test.yml/badge.svg)](https://github.com/nlibjs/cleanup-package-json/actions/workflows/test.yml)
[![codecov](https://codecov.io/gh/nlibjs/cleanup-package-json/branch/main/graph/badge.svg?token=YJG86MybgN)](https://codecov.io/gh/nlibjs/cleanup-package-json)

A command line tool to cleanup package.json before publish. It will keep the fields listed in the [documentation](https://docs.npmjs.com/configuring-npm/package-json.html) and remove the rest.

## Usage

```
npx @nlib/cleanup-package-json --file package.json
```

## LICENSE

The cleanup-package-json project is licensed under the terms of the Apache 2.0 License.
