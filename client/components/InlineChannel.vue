<template>
	<span class="inline-channel" dir="auto" role="button" tabindex="0" @click="onClick"
		><slot></slot
	></span>
</template>

<script>
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

			// TODO: Required here because it breaks tests
			const socket = require("../js/socket");
			socket.emit("input", {
				target: this.$store.state.activeChannel.channel.id,
				text: "/join " + this.channel,
			});
		},
	},
};
</script>
