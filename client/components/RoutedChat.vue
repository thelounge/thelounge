<template>
	<Chat v-if="activeChannel" :network="activeChannel.network" :channel="activeChannel.channel" />
</template>

<script>
// Temporary component for routing channels and lobbies
import Chat from "./Chat.vue";

export default {
	name: "RoutedChat",
	components: {
		Chat,
	},
	computed: {
		activeChannel() {
			const chan_id = parseInt(this.$route.params.pathMatch);
			const channel = this.$root.findChannel(chan_id);
			return channel;
		},
	},
	watch: {
		activeChannel() {
			this.setActiveChannel();
		},
	},
	mounted() {
		this.setActiveChannel();
	},
	methods: {
		setActiveChannel() {
			this.$store.commit("activeChannel", this.activeChannel);
		},
	},
};
</script>
