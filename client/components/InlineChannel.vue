<template>
	<span class="inline-channel" dir="auto" role="button" tabindex="0" @click="onClick"
		><slot></slot
	></span>
</template>

<script>
const socket = require("../js/socket");

export default {
	name: "InlineChannel",
	props: {
		channel: String,
	},
	methods: {
		onClick() {
			const existingChannel = this.$store.getters.findChannelOnCurrentNetwork(this.channel);

			if (existingChannel) {
				this.$root.switchToChannel(existingChannel);
			}

			socket.emit("input", {
				target: this.$store.state.activeChannel.channel.id,
				text: "/join " + this.channel,
			});
		},
	},
};
</script>
