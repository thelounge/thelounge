<template>
	<button
		v-if="link.type !== 'loading'"
		:class="['toggle-button', 'toggle-preview', {opened: link.shown}]"
		:aria-label="ariaLabel"
		@click="onClick"
	/>
</template>

<script lang="ts">
import {computed, defineComponent, PropType} from "vue";
import {ClientMessage, ClientLinkPreview} from "../js/types";

export default defineComponent({
	name: "LinkPreviewToggle",
	props: {
		link: {type: Object as PropType<ClientLinkPreview>, required: true},
		message: {type: Object as PropType<ClientMessage>, required: true},
	},
	emits: ["toggle-link-preview"],
	setup(props, {emit}) {
		const ariaLabel = computed(() => {
			return props.link.shown ? "Collapse preview" : "Expand preview";
		});

		const onClick = () => {
			props.link.shown = !props.link.shown;
			emit("toggle-link-preview", props.link, props.message);
		};

		return {
			ariaLabel,
			onClick,
		};
	},
});
</script>
