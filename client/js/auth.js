"use strict";

const localStorage = require("./localStorage");
const location = require("./location");

module.exports = class Auth {
	static signout() {
		localStorage.clear();
		location.reload();
	}
};
