<template>
	<NetworkForm
		v-if="$store.state.currentNetworkConfig"
		:handle-submit="handleSubmit"
		:defaults="$store.state.currentNetworkConfig"
		:disabled="disabled"
	/>
</template>

<script>
const $ = require("jquery");
const socket = require("../../js/socket");

import NetworkForm from "../NetworkForm.vue";

export default {
	name: "NetworkEdit",
	components: {
		NetworkForm,
	},
	data() {
		return {
			disabled: false,
		};
	},
	methods: {
		handleSubmit(data) {
			this.disabled = true;
			socket.emit("network:edit", data);

			const sidebar = $("#sidebar");
			// TODO: move networks to vuex and update state when the network info comes in
			const network = this.$root.networks.find((n) => n.uuid === data.uuid);
			network.name = network.channels[0].name = data.name;

			sidebar.find(`.network[data-uuid="${data.uuid}"] .chan.lobby .name`).click();
		},
	},
};
</script>
