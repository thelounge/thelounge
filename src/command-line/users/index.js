"use strict";

import config from "../../config";

if (!config.values.ldap.enable) {
	import("./add");
	import("./reset");
}

import "./list";
import "./remove";
import "./edit";
