"use strict";

global.log = require("../../src/log.js");

const home = require("path").join(__dirname, ".lounge");
require("../../src/helper").setHome(home);
