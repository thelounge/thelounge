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
			const channelToFind = this.channel.toLowerCase();
			const existingChannel = this.$root.activeChannel.network.channels.find(
				(c) => c.name.toLowerCase() === channelToFind
			);

			if (existingChannel) {
				this.$root.switchToChannel(existingChannel);
			}

			// TODO: Required here because it breaks tests
			const socket = require("../js/socket");
			socket.emit("input", {
				target: this.$root.activeChannel.channel.id,
				text: "/join " + this.channel,
			});
		},
	},
};
</script>
