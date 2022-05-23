<template>
	<Chat
		v-if="activeChannel"
		:network="activeChannel.network"
		:channel="activeChannel.channel"
		:focused="(route.query.focused as string)"
	/>
</template>

<script lang="ts">
import {watch, computed, defineComponent, onMounted} from "vue";
import {useRoute} from "vue-router";
import {useStore} from "../js/store";

// Temporary component for routing channels and lobbies
import Chat from "./Chat.vue";

export default defineComponent({
	name: "RoutedChat",
	components: {
		Chat,
	},
	setup() {
		const route = useRoute();
		const store = useStore();

		const activeChannel = computed(() => {
			const chanId = parseInt(route.params.id as string, 10);
			const channel = store.getters.findChannel(chanId);
			return channel;
		});

		const setActiveChannel = () => {
			if (activeChannel.value) {
				store.commit("activeChannel", activeChannel.value);
			}
		};

		watch(activeChannel, () => {
			setActiveChannel();
		});

		onMounted(() => {
			setActiveChannel();
		});

		return {
			route,
			activeChannel,
		};
	},
});
</script>
