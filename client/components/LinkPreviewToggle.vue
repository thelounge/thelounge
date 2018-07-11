<template>
	<button
		v-if="link.canDisplay"
		@click="onClick"
		:class="['toggle-button', 'toggle-preview', { opened: link.shown }]"/>
</template>

<script>
export default {
	name: "LinkPreviewToggle",
	props: {
		link: Object,
	},
	methods: {
		onClick: function() {
			this.link.shown = !this.link.shown;

			this.$parent.$emit("linkPreviewToggle", this.link, this.$parent.message);
		}
	}
};
</script>
