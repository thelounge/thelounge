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
			{
				'not-secure':
					channel.type === 'lobby' && network.status.connected && !network.status.secure,
			},
			{'not-connected': channel.type === 'lobby' && !network.status.connected},
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

			if (this.channel.unread > 0) {
				extra.push(`${this.channel.unread} unread`);
			}

			if (this.channel.highlight > 0) {
				extra.push(`${this.channel.highlight} mention`);
			}

			if (extra.length > 0) {
				return `${this.channel.name} (${extra.join(", ")})`;
			}

			return this.channel.name;
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
