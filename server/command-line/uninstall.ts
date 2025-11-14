import log from "../log.js";
import colors from "chalk";
import {Command} from "commander";
import Config from "../config.js";
import Utils from "./utils.js";
import fs from "node:fs/promises";
import path from "node:path";

const program = new Command("uninstall");
program
    .argument("<package>", "The package to uninstall")
    .description("Uninstall a theme or a package")
    .on("--help", Utils.extraHelp)
    .action(async function (packageName: string) {

        const packagesConfig = path.join(Config.getPackagesPath(), "package.json");
        // const packages = JSON.parse(fs.readFileSync(packagesConfig, "utf-8"));
        const packages = JSON.parse(await fs.readFile(packagesConfig, "utf-8"));

        if (
            !packages.dependencies ||
            !Object.prototype.hasOwnProperty.call(packages.dependencies, packageName)
        ) {
            log.warn(`${colors.green(packageName)} is not installed.`);
            process.exit(1);
        }

        log.info(`Uninstalling ${colors.green(packageName)}...`);

        try {
            await Utils.executeYarnCommand("remove", packageName);
            log.info(`${colors.green(packageName)} has been successfully uninstalled.`);
        } catch (code_1) {
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            log.error(`Failed to uninstall ${colors.green(packageName)}. Exit code: ${code_1}`);
            process.exit(1);
        }
    });

export default program;
