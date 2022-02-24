<template>
	<ChannelWrapper v-bind="$props" :channel="channel">
		<button
			v-if="network.channels.length > 1"
			:aria-controls="'network-' + network.uuid"
			:aria-label="getExpandLabel(network)"
			:aria-expanded="!network.isCollapsed"
			:class="['collapse-network', {collapsed: network.isCollapsed}]"
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

<style scoped>
.collapse-network {
	width: 40px;
	opacity: 0.4;
	padding-left: 11px;
	transition: opacity 0.2s;
	flex-shrink: 0;
}

.collapse-network-icon {
	display: block;
	width: 20px;
	height: 20px;
	transition: transform 0.2s;
}

.collapsed .collapse-network-icon {
	transform: rotate(-90deg);
}

.collapse-network-icon::before {
	content: "\f0d7"; /* http://fontawesome.io/icon/caret-down/ */
	color: #fff;
}

.collapse-network:hover {
	opacity: 1;
}

.channel-list-item[data-type="lobby"] .add-channel {
	border-radius: 3px;
	width: 18px;
	height: 18px;
	opacity: 0.4;
	transition: opacity 0.2s, background-color 0.2s, transform 0.2s;
}

.channel-list-item[data-type="lobby"] .add-channel::before {
	font-size: 20px;
	font-weight: normal;
	display: inline-block;
	line-height: 16px;
	text-align: center;
	content: "+";
	color: #fff;
}

.channel-list-item[data-type="lobby"] .add-channel:hover {
	opacity: 1;
}

.channel-list-item[data-type="lobby"] .add-channel.opened {
	/* translateZ(0) enables hardware acceleration, this is to avoid jittering when animating */
	transform: rotate(45deg) translateZ(0);
}

.channel-list-item[data-type="lobby"]:hover,
.channel-list-item[data-type="lobby"].active {
	color: #c0f8c3;
}
.add-channel-tooltip {
	flex-shrink: 0;
	line-height: 1;
}

.channel-list-item[data-type="lobby"] {
	color: #84ce88;
	font-size: 15px;
	font-weight: bold;
	padding-left: 0;
}

.channel-list-item .lobby-wrap {
	display: flex;
	flex-grow: 1;
	overflow: hidden;
}
</style>
<script>
import collapseNetwork from "../js/helpers/collapseNetwork";
import roundBadgeNumber from "../js/helpers/roundBadgeNumber";
import ChannelWrapper from "./ChannelWrapper.vue";

export default {
	name: "Channel",
	components: {
		ChannelWrapper,
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
		getExpandLabel(network) {
			return network.isCollapsed ? "Expand" : "Collapse";
		},
	},
};
</script>
