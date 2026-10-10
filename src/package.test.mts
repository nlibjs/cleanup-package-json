import * as childProcess from "node:child_process";
import * as fs from "node:fs";
import { fileURLToPath } from "node:url";
import ava from "ava";

const packageJsonUrl = new URL("../package.json", import.meta.url);

ava("every bin target is included in the package", (t) => {
	const packageJson = JSON.parse(fs.readFileSync(packageJsonUrl, "utf8")) as {
		bin: Record<string, string>;
	};
	const [packed] = JSON.parse(
		childProcess.execSync("npm pack --dry-run --ignore-scripts --json", {
			cwd: fileURLToPath(new URL("..", import.meta.url)),
			encoding: "utf8",
		}),
	) as Array<{ files: Array<{ path: string }> }>;
	const packedFiles = new Set(packed.files.map(({ path }) => path));
	const binTargets = Object.values(packageJson.bin);
	t.true(binTargets.length > 0);
	for (const target of binTargets) {
		t.true(packedFiles.has(target.replace(/^\.\//, "")), target);
	}
});
