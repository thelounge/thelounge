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
			v-focus
			v-model="inputChannel"
			type="text"
			class="input"
			name="channel"
			placeholder="Channel"
			pattern="[^\s]+"
			maxlength="200"
			title="The channel name may not contain spaces"
			required
		>
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
		>
		<button
			type="submit"
			class="btn btn-small">Join</button>
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
			const existingChannel = this.network.channels.find((c) => c.name.toLowerCase() === channelToFind);

			if (existingChannel) {
				const $ = require("jquery");
				$(`#sidebar .chan[data-id="${existingChannel.id}"]`).trigger("click");
			} else {
				socket.emit("input", {
					text: `/join ${this.inputChannel} ${this.inputPassword}`,
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
