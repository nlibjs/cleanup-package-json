import * as fs from "node:fs";
import ava from "ava";
import { fieldPolicies } from "./documentedFields.mjs";

const snapshot = JSON.parse(
	fs.readFileSync(
		new URL("../schemastore/package-json-keys.json", import.meta.url),
		"utf8",
	),
) as { keys: Array<string> };

ava("every SchemaStore key has a field policy", (t) => {
	t.true(snapshot.keys.length > 0);
	const unevaluated = snapshot.keys.filter((key) => !fieldPolicies.has(key));
	t.deepEqual(unevaluated, []);
});
