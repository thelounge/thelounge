<template>
	<div
		v-if="isOpen"
		id="mentions-popup-container"
		@click="containerClick"
		@contextmenu.prevent="containerClick"
	>
		<div class="mentions-popup">
			<div class="mentions-popup-title">
				Recent mentions
				<span v-if="isLoading">- Loading…</span>
			</div>
			<template v-if="resolvedMessages.length === 0">
				<p>There are no recent mentions.</p>
			</template>
			<template v-for="message in resolvedMessages" v-else>
				<div :key="message.id" :class="['msg', message.type]">
					<span class="from">
						<Username :user="message.from" />
						<template v-if="message.channel">
							in {{ message.channel.channel.name }} on
							{{ message.channel.network.name }}
						</template>
						<template v-else>
							in unknown channel
						</template>
					</span>
					<span :title="message.time | localetime" class="time">
						{{ messageTime(message.time) }}
					</span>
					<button
						class="msg-hide"
						aria-label="Hide this mention"
						@click="hideMention(message)"
					></button>
					<div class="content" dir="auto">
						<ParsedMessage :network="null" :message="message" />
					</div>
				</div>
			</template>
		</div>
	</div>
</template>

<style>
.mentions-popup {
	background-color: var(--window-bg-color);
	position: absolute;
	width: 400px;
	right: 80px;
	top: 55px;
	max-height: 400px;
	overflow-y: scroll;
	z-index: 2;
	padding: 10px;
}

.mentions-popup > .mentions-popup-title {
	margin-bottom: 10px;
	font-size: 20px;
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
}

.mentions-popup .msg-hide::before {
	font-size: 20px;
	font-weight: normal;
	display: inline-block;
	line-height: 16px;
	text-align: center;
	content: "×";
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
		this.$root.$on("mentions:toggle", this.openPopup);
	},
	destroyed() {
		this.$root.$off("mentions:toggle", this.openPopup);
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
