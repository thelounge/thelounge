<template>
	<div
		v-if="isOpen"
		id="mentions-popup-container"
		@click="containerClick"
		@contextmenu="containerClick"
	>
		<div class="mentions-popup">
			<div class="mentions-popup-title">
				Recent mentions
				<button
					v-if="resolvedMessages.length"
					class="btn hide-all-mentions"
					@click="hideAllMentions()"
				>
					Hide all
				</button>
			</div>
			<template v-if="resolvedMessages.length === 0">
				<p v-if="isLoading">Loading…</p>
				<p v-else>You have no recent mentions.</p>
			</template>
			<template v-for="message in resolvedMessages" v-else>
				<div :key="message.msgId" :class="['msg', message.type]">
					<div class="mentions-info">
						<div>
							<span class="from">
								<Username :user="message.from" />
								<template v-if="message.channel">
									in {{ message.channel.channel.name }} on
									{{ message.channel.network.name }}
								</template>
								<template v-else> in unknown channel </template>
							</span>
							<span :title="message.localetime" class="time">
								{{ messageTime(message.time) }}
							</span>
						</div>
						<div>
							<span class="close-tooltip tooltipped tooltipped-w" aria-label="Close">
								<button
									class="msg-hide"
									aria-label="Hide this mention"
									@click="hideMention(message)"
								></button>
							</span>
						</div>
					</div>
					<div class="content" dir="auto">
						<ParsedMessage :network="null" :message="message" />
					</div>
				</div>
			</template>
		</div>
	</div>
</template>

<style>
#mentions-popup-container {
	z-index: 8;
}

.mentions-popup {
	background-color: var(--window-bg-color);
	position: absolute;
	width: 400px;
	right: 80px;
	top: 55px;
	max-height: 400px;
	overflow-y: auto;
	z-index: 2;
	padding: 10px;
}

.mentions-popup > .mentions-popup-title {
	display: flex;
	justify-content: space-between;
	margin-bottom: 10px;
	font-size: 20px;
}

.mentions-popup .mentions-info {
	display: flex;
	justify-content: space-between;
}

.mentions-popup .msg {
	margin-bottom: 15px;
	user-select: text;
}

.mentions-popup .msg:last-child {
	margin-bottom: 0;
}

.mentions-popup .msg .content {
	background-color: var(--highlight-bg-color);
	border-radius: 5px;
	padding: 6px;
	margin-top: 2px;
	word-wrap: break-word;
	word-break: break-word; /* Webkit-specific */
}

.mentions-popup .msg-hide::before {
	font-size: 20px;
	font-weight: normal;
	display: inline-block;
	line-height: 16px;
	text-align: center;
	content: "×";
}

.mentions-popup .msg-hide:hover {
	color: var(--link-color);
}

.mentions-popup .hide-all-mentions {
	margin: 0;
	padding: 4px 6px;
}

@media (min-height: 500px) {
	.mentions-popup {
		max-height: 60vh;
	}
}

@media (max-width: 768px) {
	.mentions-popup {
		border-radius: 0;
		border: 0;
		box-shadow: none;
		width: 100%;
		max-height: none;
		right: 0;
		left: 0;
		bottom: 0;
		top: 45px; /* header height */
	}
}
</style>

<script>
import Username from "./Username.vue";
import ParsedMessage from "./ParsedMessage.vue";
import socket from "../js/socket";
import eventbus from "../js/eventbus";
import localetime from "../js/helpers/localetime";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default {
	name: "Mentions",
	components: {
		Username,
		ParsedMessage,
	},
	data() {
		return {
			isOpen: false,
			isLoading: false,
		};
	},
	computed: {
		resolvedMessages() {
			const messages = this.$store.state.mentions.slice().reverse();

			for (const message of messages) {
				message.localetime = localetime(message.time);
				message.channel = this.$store.getters.findChannel(message.chanId);
			}

			return messages;
		},
	},
	watch: {
		"$store.state.mentions"() {
			this.isLoading = false;
		},
	},
	mounted() {
		eventbus.on("mentions:toggle", this.openPopup);
	},
	destroyed() {
		eventbus.off("mentions:toggle", this.openPopup);
	},
	methods: {
		messageTime(time) {
			return dayjs(time).fromNow();
		},
		hideMention(message) {
			this.$store.state.mentions.splice(
				this.$store.state.mentions.findIndex((m) => m.msgId === message.msgId),
				1
			);

			socket.emit("mentions:hide", message.msgId);
		},
		hideAllMentions() {
			this.$store.state.mentions = [];
			socket.emit("mentions:hide_all");
		},
		containerClick(event) {
			if (event.currentTarget === event.target) {
				this.isOpen = false;
			}
		},
		openPopup() {
			this.isOpen = !this.isOpen;

			if (this.isOpen) {
				this.isLoading = true;
				socket.emit("mentions:get");
			}
		},
	},
};
</script>
