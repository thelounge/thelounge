import log from "../../log.js";
import colors from "chalk";
import {Command} from "commander";
import fs from "fs";
import Helper from "../../helper.js";
import Config from "../../config.js";
import Utils from "../utils.js";

const program = new Command("reset");
program
    .description("Reset user password")
    .on("--help", Utils.extraHelp)
    .argument("<name>", "name of the user")
    .option("--password [password]", "new password, will be prompted if not specified")
    .action(async function (name, cmdObj) {
        if (!fs.existsSync(Config.getUsersPath())) {
            log.error(`${Config.getUsersPath()} does not exist.`);
            return;
        }

         
        const {default: ClientManager} = await import("../../clientManager.js");
        const users = new ClientManager().getUsers();

        if (users === undefined) {
            // There was an error, already logged
            return;
        }

        if (!users.includes(name)) {
            log.error(`User ${colors.bold(name)} does not exist.`);
            return;
        }

        if (cmdObj.password) {
            change(name, cmdObj.password);
            return;
        }

        try {
            const password = await log.prompt({
                text: "Enter new password:",
                silent: true,
            });

            change(name, password);
        } catch (err) {
            log.error("Error during prompt:", String(err));
        }
    });

function change(name, password) {
    if (!password) {
        log.error("Password cannot be empty.");
        return;
    }

    const pathReal = Config.getUserConfigPath(name);
    const pathTemp = pathReal + ".tmp";
    const user = JSON.parse(fs.readFileSync(pathReal, "utf-8"));

    user.password = Helper.password.hash(password);
    user.sessions = {};

    const newUser = JSON.stringify(user, null, "\t");

    // Write to a temp file first, in case the write fails
    // we do not lose the original file (for example when disk is full)
    fs.writeFileSync(pathTemp, newUser, {
        mode: 0o600,
    });
    fs.renameSync(pathTemp, pathReal);

    log.info(`Successfully reset password for ${colors.bold(name)}.`);
}

export default program;
