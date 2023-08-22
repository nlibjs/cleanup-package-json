/**
 * https://docs.npmjs.com/cli/configuring-npm/package-json
 */
export const npmDocumentedFields = [
  'name',
  'version',
  'description',
  'keywords',
  'homepage',
  'bugs',
  'license',
  'author',
  'contributors',
  'funding',
  'files',
  'main',
  'browser',
  'bin',
  'man',
  'directories',
  'repository',
  'scripts',
  'config',
  'dependencies',
  'devDependencies',
  'peerDependencies',
  'peerDependenciesMeta',
  'bundledDependencies',
  'optionalDependencies',
  'engines',
  'os',
  'cpu',
  'private',
  'publishConfig',
  'workspaces',
];

/**
 * https://nodejs.org/api/modules.html
 * https://nodejs.org/api/esm.html
 */
export const nodejsDocumentedFields = ['type', 'imports', 'exports'];

export const unnecessaryFields = ['devDependencies'];

export const isPackageJSONRequiredKey = (
  key: string,
  keep: Array<string>,
): boolean => {
  if (keep.includes(key)) {
    return true;
  }
  if (unnecessaryFields.includes(key)) {
    return false;
  }
  if (npmDocumentedFields.includes(key)) {
    return true;
  }
  if (nodejsDocumentedFields.includes(key)) {
    return true;
  }
  return false;
};
