import Config from "../../config";
let add, reset;

if (!Config.values.ldap.enable) {
	 
	add = require("./add").default;
	 
	reset = require("./reset").default;
}

import list from "./list";
import remove from "./remove";
import edit from "./edit";

export default [list, remove, edit, add, reset];
