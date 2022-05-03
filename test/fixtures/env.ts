"use strict";

import fs from "fs";

import * as path from "path";
const home = path.join(__dirname, ".thelounge");

import config from "../../src/config";
config.setHome(home);

import STSPolicies from "../../src/plugins/sts"; // Must be imported *after* setHome
const mochaGlobalTeardown = async function () {
	STSPolicies.refresh.cancel(); // Cancel debounced function, so it does not write later
	fs.unlinkSync(STSPolicies.stsFile);
};

export default mochaGlobalTeardown;
