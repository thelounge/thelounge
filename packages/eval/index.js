"use strict";

const Client = require("../../src/client");
const Msg = require("../../src/models/msg");

module.exports = {
	client: {
		//scripts: ["eval.js"]
	}
};

const origInput = Client.prototype.input;

Client.prototype.input = function(data) {
	const client = this;

	if (data.text.startsWith("/eval ")) {
		const target = client.find(data.target);
		if (!target) {
			return;
		}

		try {
			const result = eval(data.text.substring(5));
			
			target.chan.pushMessage(this, new Msg({
				text: "[eval] " + result
			}));
		}
		catch (e) {
			target.chan.pushMessage(this, new Msg({
				type: Msg.Type.ERROR,
				text: "[eval] " + e
			}));
		}
	} else {
		origInput.apply(this, arguments);
	}
};

log.info("[eval]", "plugin loaded.");
