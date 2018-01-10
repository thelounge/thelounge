"use strict";

module.exports = class LocalUser {
	constructor(name, role) {
		this.name = name;
		this.role = role || "";
	}

	isAdmin() {
		return this.role === "admin";
	}
};
