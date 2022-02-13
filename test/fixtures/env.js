"use strict";

const fs = require("fs");

const home = require("path").join(__dirname, ".thelounge");
require("../../src/helper").setHome(home);

const STSPolicies = require("../../src/plugins/sts"); // Must be imported *after* setHome

exports.mochaGlobalTeardown = async function () {
	STSPolicies.refresh.cancel(); // Cancel debounced function, so it does not write later
	fs.unlinkSync(STSPolicies.stsFile);
};
