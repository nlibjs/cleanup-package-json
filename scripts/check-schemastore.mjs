#!/usr/bin/env node
/**
 * Compares the top-level properties of the SchemaStore package.json schema
 * with the snapshot in schemastore/package-json-keys.json.
 *
 * node scripts/check-schemastore.mjs           Exit 1 when the keys differ.
 * node scripts/check-schemastore.mjs --update  Rewrite the snapshot.
 */
import * as console from "node:console";
import * as fs from "node:fs";

const schemaUrl =
	"https://raw.githubusercontent.com/SchemaStore/schemastore/master/src/schemas/json/package.json";
const snapshotUrl = new URL(
	"../schemastore/package-json-keys.json",
	import.meta.url,
);

const response = await fetch(schemaUrl);
if (!response.ok) {
	throw new Error(`GET ${schemaUrl} returned ${response.status}`);
}
const schema = await response.json();
const latest = Object.keys(schema.properties).sort();
const snapshot = JSON.parse(fs.readFileSync(snapshotUrl, "utf8"));
const added = latest.filter((key) => !snapshot.keys.includes(key));
const removed = snapshot.keys.filter((key) => !latest.includes(key));

if (process.argv.includes("--update")) {
	const updated = { source: schemaUrl, keys: latest };
	fs.writeFileSync(snapshotUrl, `${JSON.stringify(updated, null, "\t")}\n`);
	console.log("Updated schemastore/package-json-keys.json.");
} else if (added.length > 0 || removed.length > 0) {
	console.log(`Added to SchemaStore: ${added.join(", ") || "(none)"}`);
	console.log(`Removed from SchemaStore: ${removed.join(", ") || "(none)"}`);
	console.log(
		"Add a policy for each added key in src/documentedFields.mts, then run this script with --update.",
	);
	process.exitCode = 1;
} else {
	console.log(`The snapshot matches ${latest.length} SchemaStore keys.`);
}
