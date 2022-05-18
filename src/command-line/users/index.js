"use strict";
const Config = require("../../config");

if (!Config.values.ldap.enable && !Config.values.headerAuth.enable) {
	require("./add");
	require("./reset");
}

require("./list");
require("./remove");
require("./edit");
