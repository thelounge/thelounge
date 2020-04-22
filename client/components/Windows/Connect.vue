<template>
	<NetworkForm :handle-submit="handleSubmit" :defaults="defaults" :disabled="disabled" />
</template>

<script>
import socket from "../../js/socket";
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
				let value = params[key];

				// Param can contain multiple values in an array if its supplied more than once
				if (Array.isArray(value)) {
					value = value[0];
				}

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
					this.$store.state.serverConfiguration.lockNetwork &&
					["name", "host", "port", "tls", "rejectUnauthorized"].includes(key)
				) {
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
						if (value === "0" || value === "false") {
							parsedParams[key] = false;
						} else {
							parsedParams[key] = !!value;
						}

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
