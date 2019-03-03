<template>
	<div
		v-if="
			!network.isCollapsed ||
				channel.highlight ||
				channel.type === 'lobby' ||
				(activeChannel && channel === activeChannel.channel)
		"
		:class="[
			'chan',
			channel.type,
			{active: activeChannel && channel === activeChannel.channel},
			{'parted-channel': channel.type === 'channel' && channel.state === 0},
		]"
		:aria-label="getAriaLabel()"
		:title="getAriaLabel()"
		:data-id="channel.id"
		:data-target="'#chan-' + channel.id"
		:data-name="channel.name"
		:aria-controls="'#chan-' + channel.id"
		:aria-selected="activeChannel && channel === activeChannel.channel"
		:style="closed ? {transition: 'none', opacity: 0.4} : null"
		role="tab"
	>
		<slot :network="network" :channel="channel" :activeChannel="activeChannel" />
	</div>
</template>

<script>
import socket from "../js/socket";

export default {
	name: "ChannelWrapper",
	props: {
		network: Object,
		channel: Object,
		activeChannel: Object,
	},
	data() {
		return {
			closed: false,
		};
	},
	methods: {
		close() {
			let cmd = "/close";

			if (this.channel.type === "lobby") {
				cmd = "/quit";

				if (!confirm(`Are you sure you want to remove ${this.channel.name}?`)) { // eslint-disable-line no-alert
					return false;
				}
			}

			this.closed = true;

			socket.emit("input", {
				target: Number(this.channel.id),
				text: cmd,
			});
		},
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
	},
};
</script>
