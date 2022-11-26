<template>
	<div id="chat-container" class="window">
		<div
			id="chat"
			:class="{
				'time-seconds': store.state.settings.showSeconds,
				'time-12h': store.state.settings.use12hClock,
			}"
		>
			<div
				class="chat-view"
				data-type="search-results"
				aria-label="Search results"
				role="tabpanel"
			>
				<div v-if="network && channel" class="header">
					<SidebarToggle />
					<span class="title"
						>Searching in <span class="channel-name">{{ channel.name }}</span> for</span
					>
					<span class="topic">{{ route.query.q }}</span>
					<MessageSearchForm :network="network" :channel="channel" />
					<button
						class="close"
						aria-label="Close search window"
						title="Close search window"
						@click="closeSearch"
					/>
				</div>
				<div v-if="network && channel" class="chat-content">
					<div ref="chat" class="chat" tabindex="-1">
						<div v-show="moreResultsAvailable" class="show-more">
							<button
								ref="loadMoreButton"
								:disabled="
									!!store.state.messageSearchPendingQuery ||
									!store.state.isConnected
								"
								class="btn"
								@click="onShowMoreClick"
							>
								<span v-if="store.state.messageSearchPendingQuery">Loading…</span>
								<span v-else>Show older messages</span>
							</button>
						</div>

						<div
							v-if="store.state.messageSearchPendingQuery && !offset"
							class="search-status"
						>
							Searching…
						</div>
						<div v-else-if="!messages.length && !offset" class="search-status">
							No results found.
						</div>
						<div
							class="messages"
							role="log"
							aria-live="polite"
							aria-relevant="additions"
						>
							<div
								v-for="(message, id) in messages"
								:key="message.id"
								class="result"
								@click="jump(message, id)"
							>
								<DateMarker
									v-if="shouldDisplayDateMarker(message, id)"
									:key="message.id + '-date'"
									:message="message"
								/>
								<Message
									:key="message.id"
									:channel="channel"
									:network="network"
									:message="message"
									:data-id="message.id"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style>
.channel-name {
	font-weight: 700;
}
</style>

<script lang="ts">
import socket from "../../js/socket";
import eventbus from "../../js/eventbus";

import SidebarToggle from "../SidebarToggle.vue";
import Message from "../Message.vue";
import MessageSearchForm from "../MessageSearchForm.vue";
import DateMarker from "../DateMarker.vue";
import {watch, computed, defineComponent, nextTick, ref, onMounted, onUnmounted} from "vue";
import type {ClientMessage} from "../../js/types";

import {useStore} from "../../js/store";
import {useRoute, useRouter} from "vue-router";
import {switchToChannel} from "../../js/router";
import {SearchQuery} from "../../../server/plugins/messageStorage/types";

export default defineComponent({
	name: "SearchResults",
	components: {
		SidebarToggle,
		Message,
		DateMarker,
		MessageSearchForm,
	},
	setup() {
		const store = useStore();
		const route = useRoute();
		const router = useRouter();

		const chat = ref<HTMLDivElement>();

		const loadMoreButton = ref<HTMLButtonElement>();

		const offset = ref(0);
		const moreResultsAvailable = ref(false);
		const oldScrollTop = ref(0);
		const oldChatHeight = ref(0);

		const messages = computed(() => {
			const results = store.state.messageSearchResults?.results;

			if (!results) {
				return [];
			}

			return results;
		});

		const chan = computed(() => {
			const chanId = parseInt(String(route.params.id || ""), 10);
			return store.getters.findChannel(chanId);
		});

		const network = computed(() => {
			if (!chan.value) {
				return null;
			}

			return chan.value.network;
		});

		const channel = computed(() => {
			if (!chan.value) {
				return null;
			}

			return chan.value.channel;
		});

		const setActiveChannel = () => {
			if (!chan.value) {
				return;
			}

			store.commit("activeChannel", chan.value);
		};

		const closeSearch = () => {
			if (!channel.value) {
				return;
			}

			switchToChannel(channel.value);
		};

		const shouldDisplayDateMarker = (message: ClientMessage, id: number) => {
			const previousMessage = messages.value[id - 1];

			if (!previousMessage) {
				return true;
			}

			return new Date(previousMessage.time).getDay() !== new Date(message.time).getDay();
		};

		const clearSearchState = () => {
			offset.value = 0;
			store.commit("messageSearchResults", null);
			store.commit("messageSearchPendingQuery", null);
		};

		const doSearch = () => {
			if (!network.value || !channel.value) {
				return;
			}

			clearSearchState(); // this is a new search, so we need to clear anything before that
			const query: SearchQuery = {
				networkUuid: network.value.uuid,
				channelName: channel.value.name,
				searchTerm: String(route.query.q || ""),
				offset: offset.value,
			};
			store.commit("messageSearchPendingQuery", query);
			socket.emit("search", query);
		};

		const onShowMoreClick = () => {
			if (!chat.value || !network.value || !channel.value) {
				return;
			}

			offset.value += 100;

			oldScrollTop.value = chat.value.scrollTop;
			oldChatHeight.value = chat.value.scrollHeight;

			const query: SearchQuery = {
				networkUuid: network.value.uuid,
				channelName: channel.value.name,
				searchTerm: String(route.query.q || ""),
				offset: offset.value,
			};
			store.commit("messageSearchPendingQuery", query);
			socket.emit("search", query);
		};

		const jumpToBottom = async () => {
			await nextTick();

			const el = chat.value;

			if (!el) {
				return;
			}

			el.scrollTop = el.scrollHeight;
		};

		const jump = (message: ClientMessage, id: number) => {
			// TODO: Implement jumping to messages!
			// This is difficult because it means client will need to handle a potentially nonlinear message set
			// (loading IntersectionObserver both before AND after the messages)
		};

		watch(
			() => route.params.id,
			() => {
				doSearch();
				setActiveChannel();
			}
		);

		watch(
			() => route.query,
			() => {
				doSearch();
				setActiveChannel();
			}
		);

		watch(messages, async () => {
			moreResultsAvailable.value = !!(
				messages.value.length && !(messages.value.length % 100)
			);

			if (!offset.value) {
				await jumpToBottom();
			} else {
				await nextTick();

				const el = chat.value;

				if (!el) {
					return;
				}

				const currentChatHeight = el.scrollHeight;
				el.scrollTop = oldScrollTop.value + currentChatHeight - oldChatHeight.value;
			}
		});

		onMounted(() => {
			setActiveChannel();
			doSearch();

			eventbus.on("escapekey", closeSearch);
			eventbus.on("re-search", doSearch);
		});

		onUnmounted(() => {
			eventbus.off("escapekey", closeSearch);
			eventbus.off("re-search", doSearch);
			clearSearchState();
		});

		return {
			chat,
			loadMoreButton,
			messages,
			moreResultsAvailable,
			network,
			channel,
			route,
			offset,
			store,
			setActiveChannel,
			closeSearch,
			shouldDisplayDateMarker,
			doSearch,
			onShowMoreClick,
			jumpToBottom,
			jump,
		};
	},
});
</script>
