<template>
	<SelectPopup ref="select" />
</template>

<script>
import SelectPopup from "./SelectPopup.vue";
import {generateUserContextMenu, generateChannelContextMenu} from "../js/helpers/contextMenu.js";

export default {
	name: "ContextMenu",
	components: {
		SelectPopup,
	},
	props: {
		message: Object,
	},
	mounted() {
		this.$root.$on("contextmenu:user", this.openUserContextMenu);
		this.$root.$on("contextmenu:channel", this.openChannelContextMenu);
		this.$root.$on("contextmenu:custom", this.openCustomContextMenu);
	},
	destroyed() {
		this.$root.$off("contextmenu:user", this.openUserContextMenu);
		this.$root.$off("contextmenu:channel", this.openChannelContextMenu);
		this.$root.$off("contextmenu:custom", this.openCustomContextMenu);

		if (this.$refs.select) {
			this.$refs.select.close();
		}
	},
	methods: {
		openCustomContextMenu(data) {
			this.$refs.select.open(data.event, data.items);
		},
		openChannelContextMenu(data) {
			const items = generateChannelContextMenu(this.$root, data.channel, data.network);
			this.$refs.select.open(data.event, items);
		},
		openUserContextMenu(data) {
			const {network, channel} = this.$store.state.activeChannel;

			const items = generateUserContextMenu(
				this.$root,
				channel,
				network,
				channel.users.find((u) => u.nick === data.user.nick) || {nick: data.user.nick}
			);

			this.$refs.select.open(data.event, items);
		},
	},
};
</script>
