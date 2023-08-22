#!/usr/bin/env node
import * as fs from 'fs';
import * as path from 'path';
import { Command } from 'commander';
import { cleanupPackageJSONFile } from './cleanupPackageJson.mjs';

const packageJson = JSON.parse(
  fs.readFileSync(new URL('../package.json', import.meta.url), 'utf-8'),
) as unknown as { name: string; version: string; description: string };

const program = new Command();
program.name(packageJson.name);
program.description(packageJson.description);
program.requiredOption('--file <file>', 'A path to package.json.');
program.option('--keep <fields...>', 'Specify keys to keep in the output.');
program.version(packageJson.version);
program.action(
  async ({ file, ...options }: { file: string; keep?: Array<string> }) => {
    await cleanupPackageJSONFile(path.resolve(file), options);
  },
);
await program.parseAsync();
