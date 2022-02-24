<template>
	<!-- TODO: move closed style to it's own class -->
	<div
		v-if="isChannelVisible"
		ref="element"
		:class="[
			'channel-list-item',
			{active: active},
			{'parted-channel': channel.type === 'channel' && channel.state === 0},
			{'has-draft': channel.pendingMessage},
			{'has-unread': channel.unread},
			{'has-highlight': channel.highlight},
			{
				'not-secure':
					channel.type === 'lobby' && network.status.connected && !network.status.secure,
			},
			{'not-connected': channel.type === 'lobby' && !network.status.connected},
			{'is-muted': channel.muted},
		]"
		:aria-label="getAriaLabel()"
		:title="getAriaLabel()"
		:data-name="channel.name"
		:data-type="channel.type"
		:aria-controls="'#chan-' + channel.id"
		:aria-selected="active"
		:style="channel.closed ? {transition: 'none', opacity: 0.4} : null"
		role="tab"
		@click="click"
		@contextmenu.prevent="openContextMenu"
	>
		<slot :network="network" :channel="channel" :activeChannel="activeChannel" />
	</div>
</template>

<style scoped>
.channel-list-item {
	display: flex;
	padding: 8px 14px;
	position: relative;
	cursor: pointer;
	font-size: 14px;
}

/* Channels/queries must be white on hover and active */
.channel-list-item:hover,
.channel-list-item.active {
	color: #fff;
}

.channel-list-item .not-connected-tooltip,
.channel-list-item .not-secure-tooltip,
.channel-list-item .parted-channel-tooltip {
	margin: 0 8px;
}

.channel-list-item.not-secure {
	color: #f39c12;
}

.channel-list-item.not-secure:hover,
.channel-list-item.not-secure.active {
	color: #f8c572;
}

.channel-list-item.not-connected,
.channel-list-item.parted-channel {
	color: #e74c3c;
}

.channel-list-item.not-connected:hover,
.channel-list-item.not-connected.active,
.channel-list-item.parted-channel:hover,
.channel-list-item.parted-channel.active {
	color: #f1978e;
}

.channel-list-item.is-muted {
	opacity: 0.5;
}

.channel-list-item::before {
	width: 14px;
	margin-right: 12px;
	line-height: 18px;
}
</style>
<script>
import eventbus from "../js/eventbus";
import isChannelCollapsed from "../js/helpers/isChannelCollapsed";

export default {
	name: "ChannelWrapper",
	props: {
		network: Object,
		channel: Object,
		active: Boolean,
		isFiltering: Boolean,
	},
	computed: {
		activeChannel() {
			return this.$store.state.activeChannel;
		},
		isChannelVisible() {
			return this.isFiltering || !isChannelCollapsed(this.network, this.channel);
		},
	},
	methods: {
		getAriaLabel() {
			const extra = [];
			const type = this.channel.type;

			if (this.channel.unread > 0) {
				if (this.channel.unread > 1) {
					extra.push(`${this.channel.unread} unread messages`);
				} else {
					extra.push(`${this.channel.unread} unread message`);
				}
			}

			if (this.channel.highlight > 0) {
				if (this.channel.highlight > 1) {
					extra.push(`${this.channel.highlight} mentions`);
				} else {
					extra.push(`${this.channel.highlight} mention`);
				}
			}

			return `${type}: ${this.channel.name} ${extra.length ? `(${extra.join(", ")})` : ""}`;
		},
		click() {
			if (this.isFiltering) {
				return;
			}

			this.$root.switchToChannel(this.channel);
		},
		openContextMenu(event) {
			eventbus.emit("contextmenu:channel", {
				event: event,
				channel: this.channel,
				network: this.network,
			});
		},
	},
};
</script>
