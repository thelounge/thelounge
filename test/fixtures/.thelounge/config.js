"use strict";

import config from "../../../defaults/config.js";

config.defaults[0].name = "Example IRC Server";
config.defaults[0].host = "irc.example.com";
config.public = true;
config.prefetch = true;
// @ts-ignore
config.host = config.bind = "127.0.0.1";
config.port = 61337;
config.transports = ["websocket"];

module.exports = config;
