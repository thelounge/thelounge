<template>
	<div
		id="chat-container"
		class="window">
		<div
			id="chat"
			ref="chat">
			<div
				:id="'chan-' + channel.id"
				:class="[channel.type, 'chan', 'active']"
				:data-id="channel.id"
				:data-type="channel.type"
				:aria-label="channel.name"
				role="tabpanel"
			>
				<div class="header">
					<button
						class="lt"
						aria-label="Toggle channel list"/>
					<span class="title">{{ channel.name }}</span>
					<span
						:title="channel.topic"
						class="topic"
						v-html="$options.filters.parse(channel.topic)"/>
					<button
						class="menu"
						aria-label="Open the context menu"
					/>
					<span
						v-if="channel.type === 'channel'"
						class="rt-tooltip tooltipped tooltipped-w"
						aria-label="Toggle user list">
						<button
							class="rt"
							aria-label="Toggle user list"/>
					</span>
				</div>
				<div class="chat-content">
					<div class="chat">
						<div
							v-if="channel.messages.length > 0"
							ref="loadMoreButton"
							:disabled="channel.historyLoading"
							class="show-more show"
							@click="onShowMoreClick"
						>
							<button
								v-if="channel.historyLoading"
								class="btn">Loading…</button>
							<button
								v-else
								class="btn">Show older messages</button>
						</div>
						<MessageList :channel="channel"/>
					</div>
					<ChatUserList
						v-if="channel.type === 'channel'"
						:channel="channel"/>
				</div>
			</div>
		</div>
		<div id="connection-error"/>
		<ChatInput
			:network="network"
			:channel="channel"/>
	</div>
</template>

<script>
require("intersection-observer");
const socket = require("../js/socket");
import MessageList from "./MessageList.vue";
import ChatInput from "./ChatInput.vue";
import ChatUserList from "./ChatUserList.vue";

export default {
	name: "Chat",
	components: {
		MessageList,
		ChatInput,
		ChatUserList,
	},
	props: {
		network: Object,
		channel: Object,
	},
	created() {
		if (window.IntersectionObserver) {
			this.historyObserver = new window.IntersectionObserver(loadMoreHistory, {
				root: this.$refs.chat,
			});
		}
	},
	mounted() {
		if (this.historyObserver) {
			this.historyObserver.observe(this.$refs.loadMoreButton);
		}
	},
	destroyed() {
		if (this.historyObserver) {
			this.historyObserver.disconnect();
		}
	},
	methods: {
		onShowMoreClick() {
			let lastMessage = this.channel.messages[0];
			lastMessage = lastMessage ? lastMessage.id : -1;

			this.$set(this.channel, "historyLoading", true);

			socket.emit("more", {
				target: this.channel.id,
				lastId: lastMessage,
			});
		},
	},
};

function loadMoreHistory(entries) {
	entries.forEach((entry) => {
		if (!entry.isIntersecting) {
			return;
		}

		entry.target.click();
	});
}
</script>
