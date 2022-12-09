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
					class="btn dismiss-all-mentions"
					@click="dismissAllMentions()"
				>
					Dismiss all
				</button>
			</div>
			<template v-if="resolvedMessages.length === 0">
				<p v-if="isLoading">Loading…</p>
				<p v-else>You have no recent mentions.</p>
			</template>
			<template v-for="message in resolvedMessages" v-else :key="message.msgId">
				<div :class="['msg', message.type]">
					<div class="mentions-info">
						<div>
							<span class="from">
								<Username :user="(message.from as any)" />
								<template v-if="message.channel">
									in {{ message.channel.channel.name }} on
									{{ message.channel.network.name }}
								</template>
								<template v-else> in unknown channel </template> </span
							>{{ ` ` }}
							<span :title="message.localetime" class="time">
								{{ messageTime(message.time.toString()) }}
							</span>
						</div>
						<div>
							<span
								class="close-tooltip tooltipped tooltipped-w"
								aria-label="Dismiss this mention"
							>
								<button
									class="msg-dismiss"
									aria-label="Dismiss this mention"
									@click="dismissMention(message)"
								></button>
							</span>
						</div>
					</div>
					<div class="content" dir="auto">
						<ParsedMessage :message="(message as any)" />
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

.mentions-popup .msg-dismiss::before {
	font-size: 20px;
	font-weight: normal;
	display: inline-block;
	line-height: 16px;
	text-align: center;
	content: "×";
}

.mentions-popup .msg-dismiss:hover {
	color: var(--link-color);
}

.mentions-popup .dismiss-all-mentions {
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

<script lang="ts">
import Username from "./Username.vue";
import ParsedMessage from "./ParsedMessage.vue";
import socket from "../js/socket";
import eventbus from "../js/eventbus";
import localetime from "../js/helpers/localetime";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {computed, watch, defineComponent, ref, onMounted, onUnmounted} from "vue";
import {useStore} from "../js/store";
import {ClientMention} from "../js/types";

dayjs.extend(relativeTime);

export default defineComponent({
	name: "Mentions",
	components: {
		Username,
		ParsedMessage,
	},
	setup() {
		const store = useStore();
		const isOpen = ref(false);
		const isLoading = ref(false);
		const resolvedMessages = computed(() => {
			const messages = store.state.mentions.slice().reverse();

			for (const message of messages) {
				message.localetime = localetime(message.time);
				message.channel = store.getters.findChannel(message.chanId);
			}

			return messages.filter((message) => !message.channel?.channel.muted);
		});

		watch(
			() => store.state.mentions,
			() => {
				isLoading.value = false;
			}
		);

		const messageTime = (time: string) => {
			return dayjs(time).fromNow();
		};

		const dismissMention = (message: ClientMention) => {
			store.state.mentions.splice(
				store.state.mentions.findIndex((m) => m.msgId === message.msgId),
				1
			);

			socket.emit("mentions:dismiss", message.msgId);
		};

		const dismissAllMentions = () => {
			store.state.mentions = [];
			socket.emit("mentions:dismiss_all");
		};

		const containerClick = (event: Event) => {
			if (event.currentTarget === event.target) {
				isOpen.value = false;
			}
		};

		const togglePopup = () => {
			isOpen.value = !isOpen.value;

			if (isOpen.value) {
				isLoading.value = true;
				socket.emit("mentions:get");
			}
		};

		const closePopup = () => {
			isOpen.value = false;
		};

		onMounted(() => {
			eventbus.on("mentions:toggle", togglePopup);
			eventbus.on("escapekey", closePopup);
		});

		onUnmounted(() => {
			eventbus.off("mentions:toggle", togglePopup);
			eventbus.off("escapekey", closePopup);
		});

		return {
			isOpen,
			isLoading,
			resolvedMessages,
			messageTime,
			dismissMention,
			dismissAllMentions,
			containerClick,
		};
	},
});
</script>
