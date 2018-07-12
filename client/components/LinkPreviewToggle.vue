<template>
	<button
		v-if="link.canDisplay"
		:class="['toggle-button', 'toggle-preview', { opened: link.shown }]"
		@click="onClick"/>
</template>

<script>
export default {
	name: "LinkPreviewToggle",
	props: {
		link: Object,
	},
	methods: {
		onClick() {
			this.link.shown = !this.link.shown;

			this.$parent.$emit("linkPreviewToggle", this.link, this.$parent.message);
		},
	},
};
</script>
