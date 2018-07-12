<template>
	<div
		v-if="!network.isCollapsed || channel.highlight || channel.type === 'lobby'"
		:class="[ channel.type, { active: activeChannel && channel === activeChannel.channel } ]"
		:aria-label="channel.name"
		:title="channel.name"
		:data-id="channel.id"
		:data-target="'#chan-' + channel.id"
		:aria-controls="'#chan-' + channel.id"
		:aria-selected="activeChannel && channel === activeChannel.channel"
		class="chan"
		role="tab"
	>
		<template v-if="channel.type === 'lobby'">
			<button
				v-if="network.channels.length > 1"
				:aria-controls="'network-' + network.uuid"
				:aria-label="getExpandLabel(network)"
				:aria-expanded="!network.isCollapsed"
				class="collapse-network"
				@click.prevent="onCollapseClick"
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
				:aria-label="joinChannelLabel"
				class="add-channel-tooltip tooltipped tooltipped-w tooltipped-no-touch">
				<button
					:class="['add-channel', { opened: isJoinChannelShown }]"
					:aria-controls="'join-channel-' + channel.id"
					:aria-label="joinChannelLabel"
					@click.stop="$emit('toggleJoinChannel')"/>
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
const storage = require("../js/localStorage");

export default {
	name: "Channel",
	props: {
		activeChannel: Object,
		network: Object,
		channel: Object,
		isJoinChannelShown: Boolean,
	},
	computed: {
		joinChannelLabel() {
			return this.isJoinChannelShown ? "Cancel" : "Join a channel…";
		},
	},
	methods: {
		onCollapseClick() {
			const networks = new Set(JSON.parse(storage.get("thelounge.networks.collapsed")));
			this.network.isCollapsed = !this.network.isCollapsed;

			if (this.network.isCollapsed) {
				networks.add(this.network.uuid);
			} else {
				networks.delete(this.network.uuid);
			}

			storage.set("thelounge.networks.collapsed", JSON.stringify([...networks]));
		},
		getExpandLabel(network) {
			return network.isCollapsed ? "Expand" : "Collapse";
		},
	},
};
</script>
