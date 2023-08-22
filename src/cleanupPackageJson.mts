import * as fs from 'node:fs';
import { isPackageJSONRequiredKey } from './documentedFields.mjs';

interface CleanupPackageJSONOptions {
  keep?: Array<string>;
}

const cleanupPackageJSON = <T extends Record<string, unknown>>(
  packageJSON: T,
  { keep = [] }: CleanupPackageJSONOptions = {},
): Partial<T> => {
  const result: Partial<T> = {};
  for (const key of Object.keys(packageJSON) as Array<keyof T>) {
    if (isPackageJSONRequiredKey(key as string, keep)) {
      result[key] = packageJSON[key];
    }
  }
  return result;
};

interface CleanupPackageJSONFileOptions extends CleanupPackageJSONOptions {
  indent?: number;
}

export const cleanupPackageJSONFile = async (
  packageJSONPath: string,
  { indent = 4, ...options }: CleanupPackageJSONFileOptions = {},
) => {
  await fs.promises.writeFile(
    packageJSONPath,
    JSON.stringify(
      cleanupPackageJSON(
        JSON.parse(
          await fs.promises.readFile(packageJSONPath, 'utf8'),
        ) as Record<string, unknown>,
        options,
      ),
      null,
      indent,
    ),
  );
};
