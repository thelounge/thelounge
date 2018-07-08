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
						<div
							class="messages"
							role="log"
							aria-live="polite"
							aria-relevant="additions"
						>
							<template v-for="(message, id) in channel.messages">
								<div
									v-if="shouldDisplayDateMarker(id)"
									:key="message.id + '-date'"
									:data-time="message.time"
									:aria-label="message.time | localedate"
									class="date-marker-container tooltipped tooltipped-s"
								>
									<div class="date-marker">
										<span
											:data-label="message.time | friendlydate"
											class="date-marker-text"/>
									</div>
								</div>
								<div
									v-if="shouldDisplayUnreadMarker(message.id)"
									:key="message.id + '-unread'"
									class="unread-marker"
								>
									<span class="unread-marker-text"/>
								</div>
								<Message
									:message="message"
									:key="message.id"/>
							</template>
						</div>
					</div>
					<aside
						v-if="channel.type === 'channel'"
						class="userlist">
						<div class="count">
							<input
								:placeholder="channel.users.length + ' user' + (channel.users.length === 1 ? '' : 's')"
								type="search"
								class="search"
								aria-label="Search among the user list"
								tabindex="-1">
						</div>
						<div class="names">
							<div
								v-for="(users, mode) in groupedUsers"
								:key="mode"
								:class="['user-mode', getModeClass(mode)]">
								<Username
									v-for="user in users"
									:key="user.nick"
									:user="user"/>
							</div>
						</div>
					</aside>
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
import Message from "./Message.vue";
import Username from "./Username.vue";
import ChatInput from "./ChatInput.vue";

const modes = {
	"~": "owner",
	"&": "admin",
	"!": "admin",
	"@": "op",
	"%": "half-op",
	"+": "voice",
	"": "normal",
};

export default {
	name: "Chat",
	components: {
		Message,
		Username,
		ChatInput,
	},
	props: {
		network: Object,
		channel: Object,
	},
	computed: {
		groupedUsers() {
			const groups = {};

			for (const user of this.channel.users) {
				if (!groups[user.mode]) {
					groups[user.mode] = [user];
				} else {
					groups[user.mode].push(user);
				}
			}

			return groups;
		},
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
			this.historyObserver.unobserve(this.$refs.loadMoreButton);
		}
	},
	methods: {
		shouldDisplayDateMarker(id) {
			const previousTime = this.channel.messages[id - 1];

			if (!previousTime) {
				return true;
			}

			const currentTime = this.channel.messages[id];

			return (new Date(previousTime.time)).getDay() !== (new Date(currentTime.time)).getDay();
		},
		shouldDisplayUnreadMarker(msgId) {
			if (this.channel.firstUnread < msgId) {
				return false;
			}

			this.channel.firstUnread = 0;

			return true;
		},
		getModeClass(mode) {
			return modes[mode];
		},
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
