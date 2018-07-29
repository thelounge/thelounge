<template>
	<span class="content">
		<span class="text"><ParsedMessage
			:network="network"
			:text="cleanText" /></span>
	</span>
</template>

<script>
import ParsedMessage from "../ParsedMessage.vue";

export default {
	name: "MessageTypeMOTD",
	components: {
		ParsedMessage,
	},
	props: {
		network: Object,
		message: Object,
	},
	computed: {
		cleanText() {
			let lines = this.message.text.split("\n");

			// If all non-empty lines of the MOTD start with a hyphen (which is common
			// across MOTDs), remove all the leading hyphens.
			if (lines.every((line) => line === "" || line[0] === "-")) {
				lines = lines.map((line) => line.substr(2));
			}

			// Remove empty lines around the MOTD (but not within it)
			return lines
				.map((line) => line.replace(/\s*$/,""))
				.join("\n")
				.replace(/^[\r\n]+|[\r\n]+$/g, "");
		},
	},
};
</script>
