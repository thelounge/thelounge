<template>
	<div
		v-if="networks.length === 0"
		class="empty">
		You are not connected to any networks yet.
	</div>
	<div v-else class="networks">
		<div
			v-for="network in networks"
			:key="network.uuid"
			:class="{
				collapsed: network.isCollapsed,
				'not-connected': !network.status.connected,
				'not-secure': !network.status.secure,
			}"
			:id="'network-' + network.uuid"
			:data-uuid="network.uuid"
			:data-nick="network.nick"
			class="network"
			role="region"
		>
			<NetworkLobby
				:network="network"
				:active-channel="activeChannel"
				:is-join-channel-shown="network.isJoinChannelShown"
				@toggleJoinChannel="network.isJoinChannelShown = !network.isJoinChannelShown"
			/>
			<JoinChannel
				v-if="network.isJoinChannelShown"
				:channel="network.channels[0]"
				@toggleJoinChannel="network.isJoinChannelShown = !network.isJoinChannelShown"
			/>

			<div class="channels">
				<Channel
					v-for="(channel, index) in network.channels"
					v-if="index > 0"
					:key="channel.id"
					:channel="channel"
					:network="network"
					:active-channel="activeChannel"
				/>
			</div>
		</div>
	</div>
</template>

<script>
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
	},
	props: {
		activeChannel: Object,
		networks: Array,
	},
	methods: {
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
