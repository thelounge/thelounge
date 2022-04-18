<template>
	<span
		class="inline-channel"
		dir="auto"
		role="button"
		tabindex="0"
		@click.prevent="openContextMenu"
		@contextmenu.prevent="openContextMenu"
		><slot></slot
	></span>
</template>

<script>
import eventbus from "../js/eventbus";

export default {
	name: "InlineChannel",
	props: {
		channel: String,
	},
	methods: {
		openContextMenu(event) {
			eventbus.emit("contextmenu:inline-channel", {
				event: event,
				channel: this.channel,
			});
		},
	},
};
</script>
