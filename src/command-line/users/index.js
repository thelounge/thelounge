"use strict";
const Helper = require("../../helper");

if (!Helper.config.ldap.enable && !Helper.config.headerAuth.enable) {
	require("./add");
	require("./reset");
}

require("./list");
require("./remove");
require("./edit");
