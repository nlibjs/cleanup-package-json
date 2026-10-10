import * as childProcess from 'node:child_process';
import * as console from 'node:console';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import ava from 'ava';

export interface ExecResult {
  stdout: string;
  stderr: string;
}

export const exec = async (
  command: string,
  options: childProcess.ExecOptions = {},
): Promise<ExecResult> =>
  await new Promise<ExecResult>((resolve, reject) => {
    childProcess.exec(
      command,
      { ...options, encoding: 'utf8' },
      (error, stdout, stderr) => {
        if (error) {
          console.info(`--- stdout ---\n${stdout}`);
          console.info(`--- stderr ---\n${stderr}`);
          reject(error);
        } else {
          resolve({ stdout: stdout.trim(), stderr: stderr.trim() });
        }
      },
    );
  });

const scriptPath = fileURLToPath(new URL('./cli.mjs', import.meta.url));

ava('cleanup package.json', async (t) => {
  const directory = fs.mkdtempSync(
    path.join(os.tmpdir(), 'cleanup-package-json'),
  );
  const packageJsonPath = path.join(directory, 'a.json');
  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify(
      {
        name: 'foo',
        scripts: {},
        exports: 'bar',
        ava: '',
        eslintConfig: '',
        commitlint: '',
      },
      null,
      4,
    ),
  );
  t.log(await exec(`node ${scriptPath} --file ${packageJsonPath}`));
  t.is(
    fs.readFileSync(packageJsonPath, 'utf8'),
    JSON.stringify({ name: 'foo', scripts: {}, exports: 'bar' }, null, 4),
  );
});

ava('keep some keys', async (t) => {
  const directory = fs.mkdtempSync(
    path.join(os.tmpdir(), 'cleanup-package-json'),
  );
  const packageJsonPath = path.join(directory, 'a.json');
  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify(
      {
        name: 'foo',
        exports: 'bar',
        ava: '',
        eslintConfig: '',
        commitlint: '',
        key1: 'value1',
        key2: 'value2',
        key3: 'value3',
        key4: 'value4',
      },
      null,
      4,
    ),
  );
  t.log(
    await exec(
      `node ${scriptPath} --keep key2 --keep key4 --file ${packageJsonPath}`,
    ),
  );
  t.is(
    fs.readFileSync(packageJsonPath, 'utf8'),
    JSON.stringify(
      { name: 'foo', exports: 'bar', key2: 'value2', key4: 'value4' },
      null,
      4,
    ),
  );
});

ava('keep fields required by TypeScript, bundlers, and npm', async (t) => {
  const directory = fs.mkdtempSync(
    path.join(os.tmpdir(), 'cleanup-package-json'),
  );
  const packageJsonPath = path.join(directory, 'a.json');
  const kept = {
    name: 'example',
    types: './index.d.ts',
    typings: './index.d.ts',
    typesVersions: { '*': { '*': ['types/*'] } },
    module: './index.mjs',
    sideEffects: ['./polyfill.js'],
    bundleDependencies: ['a'],
    bundledDependencies: ['b'],
    libc: ['glibc'],
    gypfile: false,
  };
  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify({ ...kept, devDependencies: {}, ava: {} }, null, 4),
  );
  t.log(await exec(`node ${scriptPath} --file ${packageJsonPath}`));
  t.deepEqual(JSON.parse(fs.readFileSync(packageJsonPath, 'utf8')), kept);
});

ava('devDependencies is removed unless kept explicitly', async (t) => {
  const directory = fs.mkdtempSync(
    path.join(os.tmpdir(), 'cleanup-package-json'),
  );
  const packageJsonPath = path.join(directory, 'a.json');
  const input = { name: 'example', devDependencies: { a: '1.0.0' } };
  fs.writeFileSync(packageJsonPath, JSON.stringify(input));
  t.log(
    await exec(
      `node ${scriptPath} --file ${packageJsonPath} --keep devDependencies`,
    ),
  );
  t.deepEqual(JSON.parse(fs.readFileSync(packageJsonPath, 'utf8')), input);
});

const invalidInputs = [
  '[{"name":"example"}]',
  '"example"',
  '42',
  'true',
  'null',
  '{',
];

for (const input of invalidInputs) {
  ava(`reject ${input} without changing the file`, async (t) => {
    const directory = fs.mkdtempSync(
      path.join(os.tmpdir(), 'cleanup-package-json'),
    );
    const packageJsonPath = path.join(directory, 'a.json');
    fs.writeFileSync(packageJsonPath, input);
    const error = await t.throwsAsync<childProcess.ExecException>(
      exec(`node ${scriptPath} --file ${packageJsonPath}`),
    );
    t.not(error?.code, 0);
    t.is(fs.readFileSync(packageJsonPath, 'utf8'), input);
  });
}

ava('keep __proto__ as an own property', async (t) => {
  const directory = fs.mkdtempSync(
    path.join(os.tmpdir(), 'cleanup-package-json'),
  );
  const packageJsonPath = path.join(directory, 'a.json');
  fs.writeFileSync(packageJsonPath, '{"name":"example","__proto__":{"x":1}}');
  t.log(
    await exec(`node ${scriptPath} --file ${packageJsonPath} --keep __proto__`),
  );
  t.is(
    fs.readFileSync(packageJsonPath, 'utf8'),
    JSON.stringify(
      JSON.parse('{"name":"example","__proto__":{"x":1}}'),
      null,
      4,
    ),
  );
});
