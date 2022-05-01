<template>
	<ChannelWrapper v-bind="$props" :channel="channel">
		<CollapseNetworkButton :network="network" :on-collapse-click="onCollapseClick" />
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
				unreadCount
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
				@click.stop="$emit('toggle-join-channel')"
			/>
		</span>
	</ChannelWrapper>
</template>

<script>
import collapseNetwork from "../js/helpers/collapseNetwork";
import roundBadgeNumber from "../js/helpers/roundBadgeNumber";
import ChannelWrapper from "./ChannelWrapper.vue";
import CollapseNetworkButton from "./CollapseNetworkButton.vue";

export default {
	name: "Channel",
	components: {
		ChannelWrapper,
		CollapseNetworkButton,
	},
	props: {
		network: Object,
		isJoinChannelShown: Boolean,
		active: Boolean,
		isFiltering: Boolean,
	},
	computed: {
		channel() {
			return this.network.channels[0];
		},
		joinChannelLabel() {
			return this.isJoinChannelShown ? "Cancel" : "Join a channel…";
		},
		unreadCount() {
			return roundBadgeNumber(this.channel.unread);
		},
	},
	methods: {
		onCollapseClick() {
			collapseNetwork(this.network, !this.network.isCollapsed);
		},
	},
};
</script>
