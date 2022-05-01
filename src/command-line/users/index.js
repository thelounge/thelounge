"use strict";

if (!require("../../config").values.ldap.enable) {
	require("./add");
	require("./reset");
}

require("./list");
require("./remove");
require("./edit");
