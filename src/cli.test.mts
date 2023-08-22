import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import * as console from 'node:console';
import * as childProcess from 'node:child_process';
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
    childProcess.exec(command, options, (error, stdout, stderr) => {
      if (error) {
        console.info(`--- stdout ---\n${stdout}`);
        console.info(`--- stderr ---\n${stderr}`);
        reject(error);
      } else {
        resolve({ stdout: stdout.trim(), stderr: stderr.trim() });
      }
    });
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
