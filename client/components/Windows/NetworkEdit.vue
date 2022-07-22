<template>
	<NetworkForm
		v-if="networkData"
		:handle-submit="handleSubmit"
		:defaults="networkData"
		:disabled="disabled"
	/>
</template>

<script lang="ts">
import {defineComponent, onMounted, ref, watch} from "vue";
import {useRoute} from "vue-router";
import {switchToChannel} from "../../js/router";
import socket from "../../js/socket";
import {useStore} from "../../js/store";
import NetworkForm, {NetworkFormDefaults} from "../NetworkForm.vue";

export default defineComponent({
	name: "NetworkEdit",
	components: {
		NetworkForm,
	},
	setup() {
		const route = useRoute();
		const store = useStore();

		const disabled = ref(false);
		const networkData = ref<NetworkFormDefaults | null>(null);

		const setNetworkData = () => {
			socket.emit("network:get", String(route.params.uuid || ""));
			networkData.value = store.getters.findNetwork(String(route.params.uuid || ""));
		};

		const handleSubmit = (data: {uuid: string; name: string}) => {
			disabled.value = true;
			socket.emit("network:edit", data);

			// TODO: move networks to vuex and update state when the network info comes in
			const network = store.getters.findNetwork(data.uuid);

			if (network) {
				network.name = network.channels[0].name = data.name;

				switchToChannel(network.channels[0]);
			}
		};

		watch(
			() => route.params.uuid,
			(newValue) => {
				setNetworkData();
			}
		);

		onMounted(() => {
			setNetworkData();
		});

		return {
			disabled,
			networkData,
			handleSubmit,
		};
	},
});
</script>
