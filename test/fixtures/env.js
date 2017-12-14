"use strict";

global.log = require("../../src/log.js");

var home = require("path").join(__dirname, ".lounge");
require("../../src/helper").setHome(home);
