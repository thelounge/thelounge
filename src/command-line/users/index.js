"use strict";

if (!require("../../helper").config.ldap.enable) {
	require("./add");
	require("./reset");
}

require("./list");
require("./remove");
require("./edit");
