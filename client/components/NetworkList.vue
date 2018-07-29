<template>
	<div
		v-if="networks.length === 0"
		class="empty">
		You are not connected to any networks yet.
	</div>
	<Draggable
		v-else
		:list="networks"
		:options="{ handle: '.lobby', draggable: '.network', ghostClass: 'network-placeholder' }"
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
			role="region">
			<NetworkLobby
				:network="network"
				:active-channel="activeChannel"
				:is-join-channel-shown="network.isJoinChannelShown"
				@toggleJoinChannel="network.isJoinChannelShown = !network.isJoinChannelShown" />
			<JoinChannel
				v-if="network.isJoinChannelShown"
				:network="network"
				:channel="network.channels[0]"
				@toggleJoinChannel="network.isJoinChannelShown = !network.isJoinChannelShown" />

			<Draggable
				:options="{ draggable: '.chan', ghostClass: 'chan-placeholder' }"
				:list="network.channels"
				class="channels"
				@change="onChannelSort"
				@start="onDragStart"
				@end="onDragEnd"
			>
				<Channel
					v-for="channel in getChannelsWithoutLobby(network)"
					:key="channel.id"
					:channel="channel"
					:network="network"
					:active-channel="activeChannel" />
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
	props: {
		activeChannel: Object,
		networks: Array,
	},
	methods: {
		onDragStart(e) {
			e.target.classList.add("ui-sortable-helper");
		},
		onDragEnd(e) {
			e.target.classList.remove("ui-sortable-helper");
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

			const {findChannel} = require("../js/vue");
			const channel = findChannel(e.moved.element.id);

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
