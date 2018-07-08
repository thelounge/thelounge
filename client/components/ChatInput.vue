<template>
	<form
		id="form"
		method="post"
		action="">
		<span id="nick">{{ network.nick }}</span>
		<textarea
			id="input"
			v-model="channel.pendingMessage"
			:placeholder="getInputPlaceholder(channel)"
			:aria-label="getInputPlaceholder(channel)"
			class="mousetrap"
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
	},
};
</script>
