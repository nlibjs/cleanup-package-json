export interface FieldPolicy {
	/** Whether the field stays in the published package.json. */
	keep: boolean;
	/** Why the field is kept or removed. */
	reason: string;
	/** Where the field is documented. */
	source: string;
}

const npm = "https://docs.npmjs.com/cli/configuring-npm/package-json";
const npmScripts = "https://docs.npmjs.com/cli/using-npm/scripts";
const nodeModules = "https://nodejs.org/api/packages.html";
const typescript =
	"https://www.typescriptlang.org/docs/handbook/declaration-files/publishing.html";
const typesVersions =
	"https://www.typescriptlang.org/docs/handbook/modules/reference.html#typesversions";
const webpackMainFields =
	"https://webpack.js.org/configuration/resolve/#resolvemainfields";
const webpackSideEffects =
	"https://webpack.js.org/guides/tree-shaking/#mark-the-file-as-side-effect-free";
const npmDevEngines =
	"https://docs.npmjs.com/cli/configuring-npm/package-json#devengines";
const corepack = "https://nodejs.org/api/corepack.html";
const yarnPackageExtensions =
	"https://yarnpkg.com/configuration/yarnrc#packageExtensions";

const kept = (source: string, reason: string): FieldPolicy => ({
	keep: true,
	reason,
	source,
});

const removed = (source: string, reason: string): FieldPolicy => ({
	keep: false,
	reason,
	source,
});

const metadata = "Describes the package on the registry.";
const install = "npm reads it when the package is installed as a dependency.";
const runtime = "Consumers or npm commands read it from the installed package.";
const compatibility =
	"npm only reads it in the project root. Kept because earlier versions of this tool kept it.";
const rootOnly =
	"Only the project root reads it, so installing the package does not use it.";

/**
 * Every field this tool has evaluated. Fields that are not listed here are
 * removed. `--keep` takes precedence over this table.
 */
export const fieldPolicies: ReadonlyMap<string, FieldPolicy> = new Map([
	["name", kept(npm, metadata)],
	["version", kept(npm, metadata)],
	["description", kept(npm, metadata)],
	["keywords", kept(npm, metadata)],
	["homepage", kept(npm, metadata)],
	["bugs", kept(npm, metadata)],
	["license", kept(npm, metadata)],
	["author", kept(npm, metadata)],
	["contributors", kept(npm, metadata)],
	["funding", kept(npm, "npm fund reads it from installed packages.")],
	["files", kept(npm, metadata)],
	["main", kept(npm, runtime)],
	["browser", kept(npm, "Bundlers read it to resolve the browser entry.")],
	["bin", kept(npm, install)],
	["man", kept(npm, install)],
	["directories", kept(npm, install)],
	["repository", kept(npm, metadata)],
	[
		"scripts",
		kept(npm, "Install lifecycle scripts run from the installed package."),
	],
	["config", kept(npm, "Lifecycle scripts read it as npm_package_config_*.")],
	["dependencies", kept(npm, install)],
	[
		"devDependencies",
		removed(
			npm,
			"Installing the package as a dependency does not install them.",
		),
	],
	["peerDependencies", kept(npm, install)],
	["peerDependenciesMeta", kept(npm, install)],
	["bundleDependencies", kept(npm, install)],
	["bundledDependencies", kept(npm, `${install} Alias of bundleDependencies.`)],
	["optionalDependencies", kept(npm, install)],
	["overrides", kept(npm, compatibility)],
	["engines", kept(npm, install)],
	["os", kept(npm, install)],
	["cpu", kept(npm, install)],
	["libc", kept(npm, install)],
	["private", kept(npm, "npm refuses to publish the package when it is true.")],
	["publishConfig", kept(npm, "npm publish reads it.")],
	["workspaces", kept(npm, compatibility)],
	["gypfile", kept(npmScripts, install)],
	["type", kept(nodeModules, runtime)],
	["imports", kept(nodeModules, runtime)],
	["exports", kept(nodeModules, runtime)],
	["types", kept(typescript, runtime)],
	["typings", kept(typescript, `${runtime} Alias of types.`)],
	["typesVersions", kept(typesVersions, runtime)],
	[
		"module",
		kept(webpackMainFields, "Bundlers read it to resolve the ESM entry."),
	],
	[
		"sideEffects",
		kept(webpackSideEffects, "Bundlers read it to decide what to tree-shake."),
	],
	["devEngines", removed(npmDevEngines, rootOnly)],
	["packageManager", removed(corepack, rootOnly)],
	["packageExtensions", removed(yarnPackageExtensions, rootOnly)],
]);

export const isPackageJSONRequiredKey = (
	key: string,
	keep: Array<string>,
): boolean => {
	if (keep.includes(key)) {
		return true;
	}
	return fieldPolicies.get(key)?.keep ?? false;
};
