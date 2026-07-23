"use strict";

const config = require("../../../defaults/config.js");

config.defaults.name = "Example IRC Server";
// Intentionally mixed-case to exercise the load-time normalization in
// Config.setHome(); it is lowercased to "irc.example.com" after load.
config.defaults.host = "irc.Example.com";
config.public = true;
config.prefetch = true;
// @ts-ignore
config.host = config.bind = "127.0.0.1";
config.port = 61337;
config.transports = ["websocket"];

module.exports = config;
