<template>
	<NetworkForm :handle-submit="handleSubmit" :defaults="defaults" :disabled="disabled" />
</template>

<script>
const socket = require("../../js/socket");

import NetworkForm from "../NetworkForm.vue";

export default {
	name: "Connect",
	components: {
		NetworkForm,
	},
	props: {
		queryParams: Object,
	},
	data() {
		// Merge settings from url params into default settings
		const defaults = Object.assign(
			{},
			this.$store.state.serverConfiguration.defaults,
			this.parseOverrideParams(this.queryParams)
		);
		return {
			disabled: false,
			defaults,
		};
	},
	methods: {
		handleSubmit(data) {
			this.disabled = true;
			socket.emit("network:new", data);
		},
		parseOverrideParams(params) {
			const parsedParams = {};

			for (let key of Object.keys(params)) {
				if (params[key] === null) {
					continue;
				}

				// Param can contain multiple values in an array if its supplied more than once
				let value = typeof params[key] === "string" ? params[key] : params[key][0];

				// Support `channels` as a compatibility alias with other clients
				if (key === "channels") {
					key = "join";
				}

				if (
					!Object.prototype.hasOwnProperty.call(
						this.$store.state.serverConfiguration.defaults,
						key
					)
				) {
					continue;
				}

				// When the network is locked, URL overrides should not affect disabled fields
				if (
					this.$store.state.lockNetwork &&
					["host", "port", "tls", "rejectUnauthorized"].includes(key)
				) {
					continue;
				}

				// When the network is not displayed, its name in the UI is not customizable
				if (!this.$store.state.serverConfiguration.displayNetwork && key === "name") {
					continue;
				}

				if (key === "join") {
					value = value
						.split(",")
						.map((chan) => {
							if (!chan.match(/^[#&!+]/)) {
								return `#${chan}`;
							}

							return chan;
						})
						.join(", ");
				}

				// Override server provided defaults with parameters passed in the URL if they match the data type
				switch (typeof this.$store.state.serverConfiguration.defaults[key]) {
					case "boolean":
						parsedParams[key] = value === "1" || value === "true";
						break;
					case "number":
						parsedParams[key] = Number(value);
						break;
					case "string":
						parsedParams[key] = String(value);
						break;
				}
			}

			return parsedParams;
		},
	},
};
</script>
