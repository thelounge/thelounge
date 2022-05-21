<template>
	<button
		v-if="favorites.length > 0"
		:aria-label="getExpandLabel()"
		:aria-expanded="isCollapsed"
		class="collapse-network"
		@click.stop="onCollapseClick"
	>
		<span class="collapse-network-icon" />
	</button>
	<span v-else class="collapse-network" />
</template>

<style scoped>
@import "./CollapseButton.css";
</style>

<script>
export default {
	name: "CollapseFavoritesButton",
	props: {
		onCollapseClick: Function,
	},
	data() {
		return {
			favorites: this.$store.state.favoriteChannels,
			isCollapsed: !this.$store.state.favoritesOpen,
		};
	},
	methods: {
		getExpandLabel() {
			return this.isCollapsed ? "Expand" : "Collapse";
		},
	},
};
</script>
