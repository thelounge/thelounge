<template>
	<button
		v-if="network.channels.length > 1"
		:aria-controls="'network-' + network.uuid"
		:aria-label="getExpandLabel(network)"
		:aria-expanded="!network.isCollapsed"
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
	name: "CollapseNetworkButton",
	props: {
		network: Object,
		onCollapseClick: Function,
	},
	methods: {
		getExpandLabel(network) {
			return network.isCollapsed ? "Expand" : "Collapse";
		},
	},
};
</script>
