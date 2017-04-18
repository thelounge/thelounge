"use strict";
const socket = require("../socket");
const render = require("../render");

socket.on("names", render.renderChannelUsers);
