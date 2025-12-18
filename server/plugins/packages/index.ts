import _ from "lodash";
import log from "../../log.js";
import colors from "chalk";
import path from "path";
import semver from "semver";
import Helper from "../../helper.js";
import Config from "../../config.js";
import themes from "./themes.js";
import inputs from "../inputs/index.js";
import fs from "fs";
import Utils from "../../command-line/utils.js";
import Client from "../../client.js";
import PublicClient from "./publicClient.js";
import Network from "../../models/network.js";
import Chan from "../../models/chan.js";

type PackageAPI = {
	Stylesheets: {addFile: (filename: string) => void};
	PublicFiles: {add: (filename: string) => void};
	Commands: {
		add: (
			command: string,
			callback: {
				input: (
					pub: PublicClient,
					netChan: {network: Network; chan: Chan},
					cmd: string,
					args: string[]
				) => void;
				allowDisconnected?: boolean;
			}
		) => void;
		runAsUser: (command: string, targetId: number, client: Client) => void;
	};
	Config: {
		getConfig: () => typeof Config.values;
		getPersistentStorageDir: () => string;
	};
	Logger: {
		error: (...args: string[]) => void;
		warn: (...args: string[]) => void;
		info: (...args: string[]) => void;
		debug: (...args: string[]) => void;
	};
};

type Package = {
	onServerStart: (packageApis: PackageAPI) => void;
};

const packageMap = new Map<string, Package>();

export type PackageInfo = {
	packageName: string;
	thelounge?: {supports: string};
	version: string;
	type?: string;
	files?: string[];
	// Legacy support
	name?: string;
	// Theme-specific fields (present when type === "theme")
	themeColor?: string;
	css?: string;
};

const stylesheets: string[] = [];
const files: string[] = [];

const TIME_TO_LIVE = 15 * 60 * 1000; // 15 minutes, in milliseconds

const cache = {
	outdated: undefined,
};

let experimentalWarningPrinted = false;
let packageWatcher: fs.FSWatcher | null = null;

export default {
	getFiles,
	getStylesheets,
	getPackage,
	loadPackages,
	outdated,
	stopWatching,
	clearPackages,
};

// TODO: verify binds worked. Used to be 'this' instead of 'packageApis'
const packageApis = function (packageInfo: PackageInfo) {
	return {
		Stylesheets: {
			addFile: addStylesheet.bind(packageApis, packageInfo.packageName),
		},
		PublicFiles: {
			add: addFile.bind(packageApis, packageInfo.packageName),
		},
		Commands: {
			add: inputs.addPluginCommand.bind(packageApis, packageInfo),
			runAsUser: (command: string, targetId: number, client: Client) =>
				client.inputLine({target: targetId, text: command}),
		},
		Config: {
			getConfig: () => Config.values,
			getPersistentStorageDir: getPersistentStorageDir.bind(
				packageApis,
				packageInfo.packageName
			),
		},
		Logger: {
			error: (...args: string[]) => log.error(`[${packageInfo.packageName}]`, ...args),
			warn: (...args: string[]) => log.warn(`[${packageInfo.packageName}]`, ...args),
			info: (...args: string[]) => log.info(`[${packageInfo.packageName}]`, ...args),
			debug: (...args: string[]) => log.debug(`[${packageInfo.packageName}]`, ...args),
		},
	};
};

function addStylesheet(packageName: string, filename: string) {
	stylesheets.push(packageName + "/" + filename);
}

function getStylesheets() {
	return stylesheets;
}

function addFile(packageName: string, filename: string) {
	files.push(packageName + "/" + filename);
}

function getFiles() {
	return files.concat(stylesheets);
}

function getPackage(name: string) {
	return packageMap.get(name);
}

function clearPackages() {
	packageMap.clear();
	stylesheets.length = 0;
	files.length = 0;
	experimentalWarningPrinted = false;
}

function getEnabledPackages(packageJson: string) {
	try {
		const json = JSON.parse(fs.readFileSync(packageJson, "utf-8"));
		return Object.keys(json.dependencies);
	} catch (e: unknown) {
		log.error(`Failed to read packages/package.json: ${colors.red(e)}`);
	}

	return [];
}

function getPersistentStorageDir(packageName: string) {
	const dir = path.join(Config.getPackagesPath(), packageName);
	fs.mkdirSync(dir, {recursive: true}); // we don't care if it already exists or not
	return dir;
}

async function loadPackage(packageName: string) {
	let packageInfo: PackageInfo;
	// TODO: type
	let packageFile: Package;

	try {
		const packagePath = Config.getPackageModulePath(packageName);

		packageInfo = JSON.parse(fs.readFileSync(path.join(packagePath, "package.json"), "utf-8"));

		if (!packageInfo.thelounge) {
			throw new Error("'thelounge' is not present in package.json");
		}

		if (
			packageInfo.thelounge.supports &&
			!semver.satisfies(Helper.getVersionNumber(), packageInfo.thelounge.supports, {
				includePrerelease: true, // our pre-releases should respect the semver guarantees
			})
		) {
			throw new Error(
				`v${packageInfo.version} does not support this version of The Lounge. Supports: ${packageInfo.thelounge.supports}`
			);
		}

		const imported = await import(packagePath);
		// Handle both ESM (direct exports) and CommonJS (wrapped in .default) modules
		packageFile = imported.default || imported;
	} catch (e: unknown) {
		log.error(`Package ${colors.bold(packageName)} could not be loaded: ${colors.red(e)}`);

		if (e instanceof Error) {
			log.debug(e.stack ? e.stack : e.message);
		}

		return;
	}

	const version = packageInfo.version;
	packageInfo = {
		...packageInfo.thelounge,
		packageName: packageName,
		version,
	};

	packageMap.set(packageName, packageFile);

	if (packageInfo.type === "theme") {
		// PackageInfo includes theme-specific fields when type === "theme"
		themes.addTheme(
			packageName,
			packageInfo as PackageInfo & {type: "theme"; themeColor: string; css: string}
		);

		if (packageInfo.files) {
			packageInfo.files.forEach((file) => addFile(packageName, file));
		}
	}

	if (packageFile.onServerStart) {
		packageFile.onServerStart(packageApis(packageInfo));
	}

	log.info(`Package ${colors.bold(packageName)} ${colors.green("v" + version)} loaded`);

	if (packageInfo.type !== "theme" && !experimentalWarningPrinted) {
		experimentalWarningPrinted = true;

		log.info(
			"There are packages using the experimental plugin API. " +
				"Be aware that this API is not yet stable and may change in future The Lounge releases."
		);
	}
}

async function loadPackages() {
	const packageJson = path.join(Config.getPackagesPath(), "package.json");
	const packages = getEnabledPackages(packageJson);

	await Promise.all(packages.map((pkg) => loadPackage(pkg)));

	watchPackages(packageJson);
}

function watchPackages(packageJson: string) {
	packageWatcher = fs.watch(
		packageJson,
		{
			persistent: false,
		},
		_.debounce(
			() => {
				void (async () => {
					const updated = getEnabledPackages(packageJson);

					for (const packageName of updated) {
						if (packageMap.has(packageName)) {
							continue;
						}

						await loadPackage(packageName);
					}
				})();
			},
			1000,
			{maxWait: 10000}
		)
	);
}

function stopWatching() {
	if (packageWatcher) {
		packageWatcher.close();
		packageWatcher = null;
	}
}

async function outdated(cacheTimeout = TIME_TO_LIVE) {
	if (cache.outdated !== undefined) {
		return cache.outdated;
	}

	// Get paths to the location of packages directory
	const packagesPath = Config.getPackagesPath();
	const packagesConfig = path.join(packagesPath, "package.json");
	const packagesList = JSON.parse(fs.readFileSync(packagesConfig, "utf-8")).dependencies;

	// Check if the configuration file exists
	if (!Object.entries(packagesList).length) {
		// CLI calls outdated with zero TTL, so we can print the warning there
		if (!cacheTimeout) {
			log.warn("There are no packages installed.");
		}

		return false;
	}

	// npm outdated returns exit code 1 when packages are outdated, 0 when all up to date
	// executeYarnCommand handles this mapping
	await Utils.executeYarnCommand("outdated")
		.then(() => updateOutdated(false))
		.catch(() => updateOutdated(true));

	if (cacheTimeout > 0) {
		setTimeout(() => {
			delete cache.outdated;
		}, cacheTimeout);
	}

	return cache.outdated;
}

function updateOutdated(outdatedPackages) {
	cache.outdated = outdatedPackages;
}
