<template>
	<div
		id="chat-container"
		class="window">
		<div
			id="chat"
			:data-id="channel.id"
			:class="{
				'hide-motd': !this.$root.settings.motd,
				'colored-nicks': this.$root.settings.coloredNicks,
				'show-seconds': this.$root.settings.showSeconds,
		}">
			<div
				:id="'chan-' + channel.id"
				:class="[channel.type, 'chan', 'active']"
				:data-id="channel.id"
				:data-type="channel.type"
				:aria-label="channel.name"
				role="tabpanel">
				<div class="header">
					<button
						class="lt"
						aria-label="Toggle channel list" />
					<span class="title">{{ channel.name }}</span>
					<span
						:title="channel.topic"
						class="topic"><ParsedMessage
							v-if="channel.topic"
							:network="network"
							:text="channel.topic" /></span>
					<button
						class="menu"
						aria-label="Open the context menu" />
					<span
						v-if="channel.type === 'channel'"
						class="rt-tooltip tooltipped tooltipped-w"
						aria-label="Toggle user list">
						<button
							class="rt"
							aria-label="Toggle user list" />
					</span>
				</div>
				<div
					v-if="channel.type === 'special'"
					class="chat-content">
					<div class="chat">
						<div class="messages">
							<div class="msg">
								<component
									:is="specialComponent"
									:network="network"
									:channel="channel" />
							</div>
						</div>
					</div>
				</div>
				<div
					v-else
					class="chat-content">
					<MessageList
						:network="network"
						:channel="channel" />
					<ChatUserList
						v-if="channel.type === 'channel'"
						:channel="channel" />
				</div>
			</div>
		</div>
		<div
			v-if="this.$root.currentUserVisibleError"
			id="connection-error"
			@click="this.$root.currentUserVisibleError = null">{{ this.$root.currentUserVisibleError }}</div>
		<span id="upload-progressbar" />
		<ChatInput
			:network="network"
			:channel="channel" />
	</div>
</template>

<script>
import ParsedMessage from "./ParsedMessage.vue";
import MessageList from "./MessageList.vue";
import ChatInput from "./ChatInput.vue";
import ChatUserList from "./ChatUserList.vue";
import ListBans from "./Special/ListBans.vue";
import ListChannels from "./Special/ListChannels.vue";
import ListIgnored from "./Special/ListIgnored.vue";

export default {
	name: "Chat",
	components: {
		ParsedMessage,
		MessageList,
		ChatInput,
		ChatUserList,
	},
	props: {
		network: Object,
		channel: Object,
	},
	computed: {
		specialComponent() {
			switch (this.channel.special) {
			case "list_bans": return ListBans;
			case "list_channels": return ListChannels;
			case "list_ignored": return ListIgnored;
			}
		},
	},
};
</script>
