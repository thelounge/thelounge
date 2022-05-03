"use strict";

import config from "../../config";
import list from "./list";
import remove from "./remove";
import edit from "./edit";

let add, reset;

(async () => {
	if (config.values.ldap.enable) {
		add = (await import("./add")).default;
		reset = (await import("./reset")).default;
	}
})();

export default [list, remove, edit, add, reset];
