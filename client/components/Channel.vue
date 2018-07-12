<template>
	<ChannelWrapper
		:network="network"
		:channel="channel"
		:active-channel="activeChannel">
		<span
			:title="channel.name"
			class="name">{{ channel.name }}</span>
		<span
			v-if="channel.unread"
			:class="{ highlight: channel.highlight }"
			class="badge">{{ channel.unread | roundBadgeNumber }}</span>
		<template v-if="channel.type === 'channel'">
			<span
				class="close-tooltip tooltipped tooltipped-w"
				aria-label="Leave">
				<button
					class="close"
					aria-label="Leave"/>
			</span>
		</template>
		<template v-else>
			<span
				class="close-tooltip tooltipped tooltipped-w"
				aria-label="Close">
				<button
					class="close"
					aria-label="Close"/>
			</span>
		</template>
	</ChannelWrapper>
</template>

<script>
import ChannelWrapper from "./ChannelWrapper.vue";

export default {
	name: "Channel",
	components: {
		ChannelWrapper,
	},
	props: {
		activeChannel: Object,
		network: Object,
		channel: Object,
	},
};
</script>
