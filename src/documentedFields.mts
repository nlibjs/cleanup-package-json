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
  'bundleDependencies',
  'bundledDependencies',
  'optionalDependencies',
  'overrides',
  'engines',
  'os',
  'cpu',
  'libc',
  'private',
  'publishConfig',
  'workspaces',
  /** https://docs.npmjs.com/cli/using-npm/scripts */
  'gypfile',
];

/**
 * https://nodejs.org/api/modules.html
 * https://nodejs.org/api/esm.html
 */
export const nodejsDocumentedFields = ['type', 'imports', 'exports'];

/**
 * https://www.typescriptlang.org/docs/handbook/declaration-files/publishing.html
 * https://www.typescriptlang.org/docs/handbook/modules/reference.html#typesversions
 */
export const typescriptDocumentedFields = ['types', 'typings', 'typesVersions'];

/**
 * https://webpack.js.org/configuration/resolve/#resolvemainfields
 * https://webpack.js.org/guides/tree-shaking/#mark-the-file-as-side-effect-free
 */
export const bundlerFields = ['module', 'sideEffects'];

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
  if (typescriptDocumentedFields.includes(key)) {
    return true;
  }
  if (bundlerFields.includes(key)) {
    return true;
  }
  return false;
};
