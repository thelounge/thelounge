<template>
	<div
		v-if="!network.isCollapsed || channel.highlight || channel.type === 'lobby' || (activeChannel && channel === activeChannel.channel)"
		:class="[ channel.type, { active: activeChannel && channel === activeChannel.channel } ]"
		:aria-label="channel.name"
		:title="channel.name"
		:data-id="channel.id"
		:data-target="'#chan-' + channel.id"
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
};
</script>
