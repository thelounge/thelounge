"use strict";

const _ = require("lodash");
const fs = require("fs");
const path = require("path");
const log = require("../log");
const Helper = require("../helper");

class STSPolicies {
	constructor() {
		this.stsFile = path.join(Helper.getHomePath(), "sts-policies.json");
		this.policies = new Map();
		this.refresh = _.debounce(this.saveFile, 10000, {maxWait: 60000});

		if (!fs.existsSync(this.stsFile)) {
			return;
		}

		const storedPolicies = JSON.parse(fs.readFileSync(this.stsFile, "utf-8"));
		const now = Date.now();

		storedPolicies.forEach((value) => {
			if (value.expires > now) {
				this.policies.set(value.host, {
					port: value.port,
					duration: value.duration,
					expires: value.expires,
				});
			}
		});
	}

	get(host) {
		const policy = this.policies.get(host);

		if (typeof policy === "undefined") {
			return null;
		}

		if (policy.expires <= Date.now()) {
			this.policies.delete(host);
			this.refresh();
			return null;
		}

		return policy;
	}

	update(host, port, duration) {
		if (duration > 0) {
			this.policies.set(host, {
				port: port,
				duration: duration,
				expires: Date.now() + duration * 1000,
			});
		} else {
			this.policies.delete(host);
		}

		this.refresh();
	}

	refreshExpiration(host) {
		const policy = this.policies.get(host);

		if (typeof policy === "undefined") {
			return null;
		}

		policy.expires = Date.now() + policy.duration * 1000;
	}

	saveFile() {
		const policiesToStore = [];

		this.policies.forEach((value, key) => {
			policiesToStore.push({
				host: key,
				port: value.port,
				duration: value.duration,
				expires: value.expires,
			});
		});

		const file = JSON.stringify(policiesToStore, null, "\t");

		fs.writeFile(this.stsFile, file, {flag: "w+"}, (err) => {
			if (err) {
				log.error("Failed to update STS policies file!", err);
			}
		});
	}
}

module.exports = new STSPolicies();
