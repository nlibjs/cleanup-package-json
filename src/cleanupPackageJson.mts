import * as fs from "node:fs";
import { isPackageJSONRequiredKey } from "./documentedFields.mjs";

interface CleanupPackageJSONOptions {
	keep?: Array<string>;
}

interface CleanupPackageJSONResult {
	packageJSON: Record<string, unknown>;
	removedKeys: Array<string>;
}

const isJSONObject = (value: unknown): value is Record<string, unknown> =>
	typeof value === "object" && value !== null && !Array.isArray(value);

const describeJSONValue = (value: unknown): string => {
	if (value === null) {
		return "null";
	}
	if (Array.isArray(value)) {
		return "an array";
	}
	return `a ${typeof value}`;
};

const cleanupPackageJSON = (
	packageJSON: Record<string, unknown>,
	{ keep = [] }: CleanupPackageJSONOptions = {},
): CleanupPackageJSONResult => {
	/** A null prototype keeps keys such as "__proto__" as own properties. */
	const result = Object.create(null) as Record<string, unknown>;
	const removedKeys: Array<string> = [];
	for (const key of Object.keys(packageJSON)) {
		if (isPackageJSONRequiredKey(key, keep)) {
			result[key] = packageJSON[key];
		} else {
			removedKeys.push(key);
		}
	}
	return { packageJSON: result, removedKeys };
};

interface CleanupPackageJSONFileOptions extends CleanupPackageJSONOptions {
	indent?: number;
	dryRun?: boolean;
}

export const cleanupPackageJSONFile = async (
	packageJSONPath: string,
	{
		indent = 4,
		dryRun = false,
		...options
	}: CleanupPackageJSONFileOptions = {},
) => {
	const parsed: unknown = JSON.parse(
		await fs.promises.readFile(packageJSONPath, "utf8"),
	);
	if (!isJSONObject(parsed)) {
		throw new TypeError(
			`${packageJSONPath} must contain a JSON object, but it contains ${describeJSONValue(parsed)}.`,
		);
	}
	const { packageJSON, removedKeys } = cleanupPackageJSON(parsed, options);
	const json = JSON.stringify(packageJSON, null, indent);
	if (!dryRun) {
		await fs.promises.writeFile(packageJSONPath, json);
	}
	return { json, removedKeys };
};
