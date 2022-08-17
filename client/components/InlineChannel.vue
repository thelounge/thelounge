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

<script lang="ts">
import {defineComponent} from "vue";
import eventbus from "../js/eventbus";

export default defineComponent({
	name: "InlineChannel",
	props: {
		channel: String,
	},
	setup(props) {
		const openContextMenu = (event) => {
			eventbus.emit("contextmenu:inline-channel", {
				event: event,
				channel: props.channel,
			});
		};

		return {
			openContextMenu,
		};
	},
});
</script>
