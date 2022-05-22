<template>
	<ChannelWrapper ref="wrapper" v-bind="$props">
		<span class="name">{{ channel.name }}</span>
		<span
			v-if="channel.unread"
			:class="{highlight: channel.highlight && !channel.muted}"
			class="badge"
			>{{ unreadCount }}</span
		>
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

<script lang="ts">
import Vue, {PropType} from "vue";
import roundBadgeNumber from "../js/helpers/roundBadgeNumber";
import {ClientChan, ClientNetwork} from "../js/types";
import ChannelWrapper from "./ChannelWrapper.vue";

export default Vue.extend({
	name: "Channel",
	components: {
		ChannelWrapper,
	},
	props: {
		network: Object as PropType<ClientNetwork>,
		channel: Object as PropType<ClientChan>,
		active: Boolean,
		isFiltering: Boolean,
	},
	computed: {
		unreadCount(): string {
			return roundBadgeNumber(this.channel.unread);
		},
	},
	methods: {
		close(): void {
			this.$root.closeChannel(this.channel);
		},
	},
});
</script>
