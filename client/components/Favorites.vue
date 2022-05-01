<template>
	<div class="favorites">
		<div class="channel-list-item" data-type="lobby" @contextmenu.prevent="openContextMenu">
			<div class="lobby-wrap">
				<CollapseFavoritesButton :on-collapse-click="onCollapseClick" />
				<span title="Favorites" class="name">Favorites</span>
			</div>
		</div>
		<Draggable
			draggable=".channel-list-item"
			ghost-class="ui-sortable-ghost"
			drag-class="ui-sortable-dragging"
			:group="network.uuid"
			:list="channels"
			:delay="longTouchDuration"
			:delay-on-touch-only="true"
			:touch-start-threshold="10"
			class="channels"
			@choose="onDraggableChoose"
			@unchoose="onDraggableUnchoose"
		>
			<template v-for="channel in channels">
				<Channel
					:key="channel.id"
					:channel="channel"
					:network="network"
					:is-filtering="false"
					:active="
						$store.state.activeChannel && channel === $store.state.activeChannel.channel
					"
				/>
			</template>
		</Draggable>
	</div>
</template>

<script>
import Draggable from "vuedraggable";
import eventbus from "../js/eventbus";
import Channel from "./Channel.vue";
import CollapseFavoritesButton from "./CollapseFavoritesButton.vue";

export default {
	name: "Favorites",
	components: {
		Channel,
		CollapseFavoritesButton,
		Draggable,
	},
	props: {
		channels: Array,
		onDraggableUnchoose: Function,
		onDraggableChoose: Function,
		longTouchDuration: Number,
	},
	computed: {
		network() {
			return {
				isCollapsed: !this.$store.state.favoritesOpen,
				status: {
					connected: true,
					secure: true,
				},
			};
		},
	},
	methods: {
		onCollapseClick() {
			this.$store.commit("toggleFavorites");
		},
		openContextMenu(event) {
			eventbus.emit("contextmenu:favorites", {
				event: event,
				channel: this.channel,
			});
		},
	},
};
</script>
