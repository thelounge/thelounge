<template>
	<NetworkForm
		:handle-submit="handleSubmit"
		:defaults="$root.serverConfiguration.defaults"
		:disabled="disabled"
	/>
</template>

<script>
const socket = require("../../js/socket");

import NetworkForm from "../NetworkForm.vue";

export default {
	name: "Connect",
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
			socket.emit("network:new", data);
		},
	},
};
</script>
