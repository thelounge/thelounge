<template>
	<div
		v-if="!network.isCollapsed || channel.highlight || channel.type === 'lobby' || (activeChannel && channel === activeChannel.channel)"
		:class="[ channel.type, { active: activeChannel && channel === activeChannel.channel } ]"
		:aria-label="getAriaLabel()"
		:title="getAriaLabel()"
		:data-id="channel.id"
		:data-target="'#chan-' + channel.id"
		:data-name="channel.name"
		:aria-controls="'#chan-' + channel.id"
		:aria-selected="activeChannel && channel === activeChannel.channel"
		class="chan"
		role="tab">
		<slot
			:network="network"
			:channel="channel"
			:activeChannel="activeChannel" />
	</div>
</template>

<script>
export default {
	name: "ChannelWrapper",
	props: {
		network: Object,
		channel: Object,
		activeChannel: Object,
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
	},
};
</script>
