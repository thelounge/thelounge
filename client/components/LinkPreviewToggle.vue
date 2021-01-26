<template>
	<button
		v-if="link.type !== 'loading'"
		:class="['toggle-button', 'toggle-preview', {opened: link.shown}]"
		:aria-label="ariaLabel"
		@click="onClick"
	/>
</template>

<script>
export default {
	name: "LinkPreviewToggle",
	props: {
		link: Object,
	},
	computed: {
		ariaLabel() {
			return this.link.shown ? "Collapse preview" : "Expand preview";
		},
	},
	methods: {
		onClick() {
			this.link.shown = !this.link.shown;

			this.$parent.$emit("toggle-link-preview", this.link, this.$parent.message);
		},
	},
};
</script>
