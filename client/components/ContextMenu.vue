<template>
	<SelectPopup ref="select" />
</template>

<script>
import SelectPopup from "./SelectPopup.vue";
import {generateUserContextMenu, generateChannelContextMenu} from "../js/helpers/contextMenu.js";
import eventbus from "../js/eventbus";

export default {
	name: "ContextMenu",
	components: {
		SelectPopup,
	},
	props: {
		message: Object,
	},
	mounted() {
		eventbus.on("escapekey", this.close);
		eventbus.on("contextmenu:user", this.openUserContextMenu);
		eventbus.on("contextmenu:channel", this.openChannelContextMenu);
		eventbus.on("contextmenu:custom", this.openCustomContextMenu);
	},
	destroyed() {
		eventbus.off("escapekey", this.close);
		eventbus.off("contextmenu:user", this.openUserContextMenu);
		eventbus.off("contextmenu:channel", this.openChannelContextMenu);
		eventbus.off("contextmenu:custom", this.openCustomContextMenu);

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
				channel.users.find((u) => u.nick === data.user.nick) || {
					nick: data.user.nick,
					modes: [],
				}
			);

			this.$refs.select.open(data.event, items);
		},
	},
};
</script>
