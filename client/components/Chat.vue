<template>
	<div
		id="chat-container"
		class="window">
		<div
			id="chat"
			:data-id="channel.id"
			:class="{
				'hide-motd': !settings.motd,
				'hide-status-messages': settings.statusMessages === 'hidden',
				'condensed-status-messages': settings.statusMessages === 'condensed',
				'colored-nicks': settings.coloredNicks,
				'show-seconds': settings.showSeconds,
			}"
		>
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
				<div
					v-if="channel.type === 'special'"
					class="chat-content">
					<component
						:is="specialComponent"
						:channel="channel"/>
				</div>
				<div
					v-else
					class="chat-content">
					<div
						ref="chat"
						class="chat"
					>
						<div :class="['show-more', { show: channel.moreHistoryAvailable }]">
							<button
								ref="loadMoreButton"
								:disabled="channel.historyLoading || !$root.connected"
								class="btn"
								@click="onShowMoreClick"
							>
								<span v-if="channel.historyLoading">Loading…</span>
								<span v-else>Show older messages</span>
							</button>
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
import ListBans from "./Special/ListBans.vue";
import ListChannels from "./Special/ListChannels.vue";
import ListIgnored from "./Special/ListIgnored.vue";

export default {
	name: "Chat",
	components: {
		MessageList,
		ChatInput,
		ChatUserList,
	},
	props: {
		settings: Object,
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
	watch: {
		"channel.id"() {
			if (this.$refs.loadMoreButton) {
				this.$nextTick(() => {
					const bounding = this.$refs.loadMoreButton.getBoundingClientRect();

					if (bounding.top >= 0) {
						this.$refs.loadMoreButton.click();
					}
				});
			}
		},
		"channel.messages"() {
			const el = this.$refs.chat;

			if (!el) {
				return;
			}

			if (el.scrollHeight - el.scrollTop - el.offsetHeight > 30) {
				return;
			}

			this.$nextTick(() => {
				el.scrollTop = el.scrollHeight;
			});
		},
	},
	created() {
		this.$nextTick(() => {
			if (!this.$refs.chat) {
				return;
			}

			if (window.IntersectionObserver) {
				this.historyObserver = new window.IntersectionObserver(loadMoreHistory, {
					root: this.$refs.chat,
				});
			}

			this.$refs.chat.scrollTop = this.$refs.chat.scrollHeight;
		});
	},
	mounted() {
		this.$nextTick(() => {
			if (this.historyObserver) {
				this.historyObserver.observe(this.$refs.loadMoreButton);
			}
		});
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
