<template>
	<div v-if="networks.length === 0" class="empty">
		You are not connected to any networks yet.
	</div>
	<Draggable
		v-else
		:list="networks"
		:filter="isCurrentlyInTouch"
		:prevent-on-filter="false"
		handle=".lobby"
		draggable=".network"
		ghost-class="ui-sortable-ghost"
		drag-class="ui-sortable-dragged"
		group="networks"
		class="networks"
		@change="onNetworkSort"
		@start="onDragStart"
		@end="onDragEnd"
	>
		<div
			v-for="network in networks"
			:id="'network-' + network.uuid"
			:key="network.uuid"
			:class="{
				collapsed: network.isCollapsed,
				'not-connected': !network.status.connected,
				'not-secure': !network.status.secure,
			}"
			:data-uuid="network.uuid"
			:data-nick="network.nick"
			class="network"
			role="region"
		>
			<NetworkLobby
				:network="network"
				:is-join-channel-shown="network.isJoinChannelShown"
				@toggleJoinChannel="network.isJoinChannelShown = !network.isJoinChannelShown"
			/>
			<JoinChannel
				v-if="network.isJoinChannelShown"
				:network="network"
				:channel="network.channels[0]"
				@toggleJoinChannel="network.isJoinChannelShown = !network.isJoinChannelShown"
			/>

			<Draggable
				draggable=".chan"
				ghost-class="ui-sortable-ghost"
				drag-class="ui-sortable-dragged"
				:group="network.uuid"
				:filter="isCurrentlyInTouch"
				:prevent-on-filter="false"
				:list="network.channels"
				class="channels"
				@change="onChannelSort"
				@start="onDragStart"
				@end="onDragEnd"
			>
				<Channel
					v-for="(channel, index) in network.channels"
					v-if="index > 0"
					:key="channel.id"
					:channel="channel"
					:network="network"
				/>
			</Draggable>
		</div>
	</Draggable>
</template>

<script>
import Draggable from "vuedraggable";
import NetworkLobby from "./NetworkLobby.vue";
import Channel from "./Channel.vue";
import JoinChannel from "./JoinChannel.vue";

import socket from "../js/socket";

export default {
	name: "NetworkList",
	components: {
		JoinChannel,
		NetworkLobby,
		Channel,
		Draggable,
	},
	computed: {
		networks() {
			return this.$store.state.networks;
		},
	},
	methods: {
		isCurrentlyInTouch(e) {
			// TODO: Implement a way to sort on touch devices
			return e.pointerType !== "mouse";
		},
		onDragStart(e) {
			e.target.classList.add("ui-sortable-active");
		},
		onDragEnd(e) {
			e.target.classList.remove("ui-sortable-active");
		},
		onNetworkSort(e) {
			if (!e.moved) {
				return;
			}

			socket.emit("sort", {
				type: "networks",
				order: this.networks.map((n) => n.uuid),
			});
		},
		onChannelSort(e) {
			if (!e.moved) {
				return;
			}

			const channel = this.$store.getters.findChannel(e.moved.element.id);

			if (!channel) {
				return;
			}

			socket.emit("sort", {
				type: "channels",
				target: channel.network.uuid,
				order: channel.network.channels.map((c) => c.id),
			});
		},
	},
};
</script>
