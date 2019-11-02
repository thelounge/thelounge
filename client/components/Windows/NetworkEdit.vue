<template>
	<NetworkForm
		v-if="networkData"
		:handle-submit="handleSubmit"
		:defaults="networkData"
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
			networkData: null,
		};
	},
	watch: {
		"$route.params.uuid"() {
			this.setNetworkData();
		},
	},
	mounted() {
		this.setNetworkData();
	},
	methods: {
		setNetworkData() {
			socket.emit("network:get", this.$route.params.uuid);
			this.networkData = this.$root.findNetwork(this.$route.params.uuid);
		},
		handleSubmit(data) {
			this.disabled = true;
			socket.emit("network:edit", data);

			const sidebar = $("#sidebar");
			// TODO: move networks to vuex and update state when the network info comes in
			const network = this.$root.findNetwork(data.uuid);
			network.name = network.channels[0].name = data.name;
			sidebar.find(`.network[data-uuid="${data.uuid}"] .chan.lobby .name`).click();
		},
	},
};
</script>
