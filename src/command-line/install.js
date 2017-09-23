"use strict";

const colors = require("colors/safe");
const program = require("commander");
const Helper = require("../helper");
const Utils = require("./utils");

program
	.command("install <package>")
	.description("Install a theme or a package")
	.on("--help", Utils.extraHelp)
	.action(function(packageName) {
		const fs = require("fs");
		const fsextra = require("fs-extra");
		const path = require("path");
		const child = require("child_process");
		const registryUrl = require("registry-url");
		const registryAuthToken = require("registry-auth-token");
		const url = require("url");
		const request = require("request");

		if (!fs.existsSync(Helper.CONFIG_PATH)) {
			log.error(`${Helper.CONFIG_PATH} does not exist.`);
			return;
		}

		const scope = packageName.split("/")[0];
		const regUrl = registryUrl(scope);
		const pkgUrl = url.resolve(regUrl, encodeURIComponent(packageName).replace(/^%40/, "@") + "/latest");
		const authInfo = registryAuthToken(regUrl, {recursive: true});

		const headers = {};
		if (authInfo) {
			headers.Authorization = `${authInfo.type} ${authInfo.token}`;
		}

		request.get({url: pkgUrl, headers: headers}, (error, res, body) => {
			if (error) {
				log.error(`${error}`);
				process.exit(1);
			}

			if (res.statusCode === 404) {
				log.error(`Package ${colors.green(packageName)} does not exist`);
				process.exit(1);
			}

			if (res.statusCode !== 200) {
				log.error(`Failed to download ${colors.green(packageName)}. Error code: ${res.statusCode}`);
				process.exit(1);
			}

			const json = JSON.parse(body);

			if (!("lounge" in json)) {
				log.error(`${colors.red(packageName)} does not have The Lounge metadata.`);

				process.exit(1);
			}

			log.info(`Installing ${colors.green(packageName)}...`);

			const packagesPath = Helper.getPackagesPath();
			const packagesParent = path.dirname(packagesPath);
			const packagesConfig = path.join(packagesParent, "package.json");

			// Create node_modules folder, otherwise npm will start walking upwards to find one
			fsextra.ensureDirSync(packagesPath);

			// Create package.json with private set to true to avoid npm warnings
			fs.writeFileSync(packagesConfig, JSON.stringify({
				private: true,
				description: "Packages for The Lounge. All packages in node_modules directory will be automatically loaded.",
			}, null, "\t"));

			const npm = child.spawn(
				process.platform === "win32" ? "npm.cmd" : "npm",
				[
					"install",
					"--production",
					"--no-save",
					"--no-bin-links",
					"--no-package-lock",
					"--prefix",
					packagesParent,
					packageName
				],
				{
					stdio: "inherit"
				}
			);

			npm.on("error", (e) => {
				log.error(`${e}`);
				process.exit(1);
			});

			npm.on("close", (code) => {
				if (code !== 0) {
					log.error(`Failed to install ${colors.green(packageName)}. Exit code: ${code}`);
					return;
				}

				log.info(`${colors.green(packageName)} has been successfully installed.`);
			});
		});
	});
