<template>
	<form
		id="form"
		method="post"
		action=""
		@submit.prevent="onSubmit">
		<span id="nick">{{ network.nick }}</span>
		<textarea
			id="input"
			ref="input"
			v-model="channel.pendingMessage"
			:placeholder="getInputPlaceholder(channel)"
			:aria-label="getInputPlaceholder(channel)"
			class="mousetrap"
			@keyup.enter="onSubmit"
		/>
		<span
			id="submit-tooltip"
			class="tooltipped tooltipped-w tooltipped-no-touch"
			aria-label="Send message">
			<button
				id="submit"
				type="submit"
				aria-label="Send message"/>
		</span>
	</form>
</template>

<script>
const $ = require("jquery");
const socket = require("../js/socket");

export default {
	name: "ChatInput",
	props: {
		network: Object,
		channel: Object,
	},
	mounted() {
		if (this.$root.settings.autocomplete) {
			require("../js/autocompletion").enable();
		}
	},
	destroyed() {
		require("../js/autocompletion").disable();
	},
	methods: {
		getInputPlaceholder(channel) {
			if (channel.type === "channel" || channel.type === "query") {
				return `Write to ${channel.name}`;
			}

			return "";
		},
		onSubmit() {
			// Triggering click event opens the virtual keyboard on mobile
			// This can only be called from another interactive event (e.g. button click)
			$(this.$refs.input).trigger("click").trigger("focus");

			const target = this.channel.id;
			const text = input.value;

			if (text.length === 0) {
				return false;
			}

			input.value = "";
			// resetInputHeight(input.get(0));

			if (text.charAt(0) === "/") {
				const args = text.substr(1).split(" ");
				const cmd = args.shift().toLowerCase();

				if (typeof utils.inputCommands[cmd] === "function" && utils.inputCommands[cmd](args)) {
					return false;
				}
			}

			socket.emit("input", {target, text});
		},
	},
};
</script>
