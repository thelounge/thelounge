<template>
	<div
		:key="channel.id"
		:class="[ channel.type, { active: activeChannel && channel.id === activeChannel.channel.id } ]"
		:aria-label="channel.name"
		:title="channel.name"
		:data-id="channel.id"
		:data-target="'#chan-' + channel.id"
		:aria-controls="'#chan-' + channel.id"
		:aria-selected="activeChannel && channel.id === activeChannel.channel.id"
		class="chan"
		role="tab"
	>
		<template v-if="channel.type === 'lobby'">
			<button
				v-if="network.channels.length > 1"
				:aria-controls="'network-' + network.uuid"
				class="collapse-network"
				aria-label="Collapse"
				aria-expanded="true"
			>
				<span class="collapse-network-icon"/>
			</button>
			<span
				v-else
				class="collapse-network"/>
			<div class="lobby-wrap">
				<span
					:title="channel.name"
					class="name">{{ channel.name }}</span>
				<span
					class="not-secure-tooltip tooltipped tooltipped-w"
					aria-label="Insecure connection">
					<span class="not-secure-icon"/>
				</span>
				<span
					class="not-connected-tooltip tooltipped tooltipped-w"
					aria-label="Disconnected">
					<span class="not-connected-icon"/>
				</span>
				<span
					v-if="channel.unread"
					:class="{ highlight: channel.highlight }"
					class="badge">{{ channel.unread | roundBadgeNumber }}</span>
			</div>
			<span
				class="add-channel-tooltip tooltipped tooltipped-w tooltipped-no-touch"
				aria-label="Join a channel…"
				data-alt-label="Cancel">
				<button
					:aria-controls="'join-channel-' + channel.id"
					class="add-channel"
					aria-label="Join a channel…"/>
			</span>
		</template>
		<template v-else>
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
		</template>
	</div>
</template>

<script>
export default {
	name: "Channel",
	props: {
		activeChannel: Object,
		network: Object,
		channel: Object,
	},
};
</script>
