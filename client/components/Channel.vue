<template>
	<ChannelWrapper ref="wrapper" :network="network" :channel="channel">
		<span class="name">{{ channel.name }}</span>
		<span v-if="channel.unread" :class="{highlight: channel.highlight}" class="badge">{{
			unreadCount
		}}</span>
		<template v-if="channel.type === 'channel'">
			<span
				v-if="channel.state === 0"
				class="parted-channel-tooltip tooltipped tooltipped-w"
				aria-label="Not currently joined"
			>
				<span class="parted-channel-icon" />
			</span>
			<span class="close-tooltip tooltipped tooltipped-w" aria-label="Leave">
				<button class="close" aria-label="Leave" @click.stop="close" />
			</span>
		</template>
		<template v-else>
			<span class="close-tooltip tooltipped tooltipped-w" aria-label="Close">
				<button class="close" aria-label="Close" @click.stop="close" />
			</span>
		</template>
	</ChannelWrapper>
</template>

<script>
const roundBadgeNumber = require("../js/helpers/roundBadgeNumber");
import ChannelWrapper from "./ChannelWrapper.vue";

export default {
	name: "Channel",
	components: {
		ChannelWrapper,
	},
	props: {
		network: Object,
		channel: Object,
	},
	computed: {
		unreadCount() {
			return roundBadgeNumber(this.channel.unread);
		},
	},
	methods: {
		close() {
			this.$refs.wrapper.close();
		},
	},
};
</script>
