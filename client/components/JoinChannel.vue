<template>
	<form
		:id="'join-channel-' + channel.id"
		class="join-form"
		method="post"
		action=""
		autocomplete="off"
		@keydown.esc.prevent="$emit('toggleJoinChannel')"
		@submit.prevent="onSubmit"
	>
		<input
			v-model="inputChannel"
			v-focus
			type="text"
			class="input"
			name="channel"
			placeholder="Channel"
			pattern="[^\s]+"
			maxlength="200"
			title="The channel name may not contain spaces"
			required
		/>
		<input
			v-model="inputPassword"
			type="password"
			class="input"
			name="key"
			placeholder="Password (optional)"
			pattern="[^\s]+"
			maxlength="200"
			title="The channel password may not contain spaces"
			autocomplete="new-password"
		/>
		<button type="submit" class="btn btn-small">Join</button>
	</form>
</template>

<script>
import socket from "../js/socket";

export default {
	name: "JoinChannel",
	directives: {
		focus: {
			inserted(el) {
				el.focus();
			},
		},
	},
	props: {
		network: Object,
		channel: Object,
	},
	data() {
		return {
			inputChannel: "",
			inputPassword: "",
		};
	},
	methods: {
		onSubmit() {
			const channelToFind = this.inputChannel.toLowerCase();
			const existingChannel = this.network.channels.find(
				(c) => c.name.toLowerCase() === channelToFind
			);

			if (existingChannel) {
				this.$router.push("chan-" + existingChannel.id);
			} else {
				const chanTypes = this.network.serverOptions.CHANTYPES;
				let channel = this.inputChannel;

				if (chanTypes && chanTypes.length > 0 && !chanTypes.includes(channel[0])) {
					channel = chanTypes[0] + channel;
				}

				socket.emit("input", {
					text: `/join ${channel} ${this.inputPassword}`,
					target: this.channel.id,
				});
			}

			this.inputChannel = "";
			this.inputPassword = "";
			this.$emit("toggleJoinChannel");
		},
	},
};
</script>
