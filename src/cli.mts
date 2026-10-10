#!/usr/bin/env node
import * as console from "node:console";
import * as fs from "node:fs";
import * as path from "node:path";
import { Command } from "commander";
import { cleanupPackageJSONFile } from "./cleanupPackageJson.mjs";

const packageJson = JSON.parse(
	fs.readFileSync(new URL("../package.json", import.meta.url), "utf-8"),
) as unknown as { name: string; version: string; description: string };

const program = new Command();
program.name(packageJson.name);
program.description(packageJson.description);
program.requiredOption("--file <file>", "A path to package.json.");
program.option("--keep <fields...>", "Specify keys to keep in the output.");
program.option(
	"--dry-run",
	"Print the result and the removed keys without changing the file.",
);
program.version(packageJson.version);
program.action(
	async ({
		file,
		...options
	}: {
		file: string;
		keep?: Array<string>;
		dryRun?: boolean;
	}) => {
		try {
			const { json, removedKeys } = await cleanupPackageJSONFile(
				path.resolve(file),
				options,
			);
			if (options.dryRun) {
				console.error(
					removedKeys.length > 0
						? `Keys to remove: ${removedKeys.join(", ")}`
						: "No keys to remove.",
				);
				console.log(json);
			}
		} catch (error) {
			console.error(error instanceof Error ? error.message : error);
			process.exitCode = 1;
		}
	},
);
await program.parseAsync();
