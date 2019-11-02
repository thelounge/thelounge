<template>
	<ChannelWrapper :network="network" :channel="channel">
		<button
			v-if="network.channels.length > 1"
			:aria-controls="'network-' + network.uuid"
			:aria-label="getExpandLabel(network)"
			:aria-expanded="!network.isCollapsed"
			class="collapse-network"
			@click.stop="onCollapseClick"
		>
			<span class="collapse-network-icon" />
		</button>
		<span v-else class="collapse-network" />
		<div class="lobby-wrap">
			<span :title="channel.name" class="name">{{ channel.name }}</span>
			<span
				v-if="network.status.connected && !network.status.secure"
				class="not-secure-tooltip tooltipped tooltipped-w"
				aria-label="Insecure connection"
			>
				<span class="not-secure-icon" />
			</span>
			<span
				v-if="!network.status.connected"
				class="not-connected-tooltip tooltipped tooltipped-w"
				aria-label="Disconnected"
			>
				<span class="not-connected-icon" />
			</span>
			<span v-if="channel.unread" :class="{highlight: channel.highlight}" class="badge">{{
				channel.unread | roundBadgeNumber
			}}</span>
		</div>
		<span
			:aria-label="joinChannelLabel"
			class="add-channel-tooltip tooltipped tooltipped-w tooltipped-no-touch"
		>
			<button
				:class="['add-channel', {opened: isJoinChannelShown}]"
				:aria-controls="'join-channel-' + channel.id"
				:aria-label="joinChannelLabel"
				@click.stop="$emit('toggleJoinChannel')"
			/>
		</span>
		<button class="close" hidden @click="close" />
	</ChannelWrapper>
</template>

<script>
import ChannelWrapper from "./ChannelWrapper.vue";
import socket from "../js/socket";
const storage = require("../js/localStorage");

export default {
	name: "Channel",
	components: {
		ChannelWrapper,
	},
	props: {
		network: Object,
		isJoinChannelShown: Boolean,
	},
	computed: {
		channel() {
			return this.network.channels[0];
		},
		joinChannelLabel() {
			return this.isJoinChannelShown ? "Cancel" : "Join a channel…";
		},
	},
	methods: {
		close() {
			// eslint-disable-next-line no-alert
			if (!confirm(`Are you sure you want to remove ${this.channel.name}?`)) {
				return false;
			}

			socket.emit("input", {
				target: Number(this.channel.id),
				text: "/quit",
			});
		},
		onCollapseClick() {
			const networks = new Set(JSON.parse(storage.get("thelounge.networks.collapsed")));
			this.network.isCollapsed = !this.network.isCollapsed;

			if (this.network.isCollapsed) {
				networks.add(this.network.uuid);
			} else {
				networks.delete(this.network.uuid);
			}

			storage.set("thelounge.networks.collapsed", JSON.stringify([...networks]));
		},
		getExpandLabel(network) {
			return network.isCollapsed ? "Expand" : "Collapse";
		},
	},
};
</script>
