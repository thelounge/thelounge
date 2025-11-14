import Config from "../../config.js";
import list from "./list.js";
import remove from "./remove.js";
import edit from "./edit.js";
import type {Command} from "commander";

let add: Command | undefined;
let reset: Command | undefined;

if (!Config.values.ldap.enable) {
    const addModule = await import("./add.js");
    const resetModule = await import("./reset.js");
    add = addModule.default;
    reset = resetModule.default;
}

export default [list, remove, edit, add, reset];
