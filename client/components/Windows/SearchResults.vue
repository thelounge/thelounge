<template>
	<div id="chat-container" class="window">
		<div
			id="chat"
			:class="{
				'colored-nicks': store.state.settings.coloredNicks,
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
									store.state.messageSearchInProgress || !store.state.isConnected
								"
								class="btn"
								@click="onShowMoreClick"
							>
								<span v-if="store.state.messageSearchInProgress">Loading…</span>
								<span v-else>Show older messages</span>
							</button>
						</div>

						<div
							v-if="store.state.messageSearchInProgress && !offset"
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
								@:click="jump(message, id)"
							>
								<!-- TODO: this was message.date  -->
								<DateMarker
									v-if="shouldDisplayDateMarker(message, id)"
									:key="message.time"
									:message="message"
								/>
								<!-- todo channel and network ! -->
								<Message
									:key="message.id"
									:channel="channel!"
									:network="network!"
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
		const chatRef = chat.value;

		const loadMoreButton = ref<HTMLButtonElement>();

		const offset = ref(0);
		const moreResultsAvailable = ref(false);
		const oldScrollTop = ref(0);
		const oldChatHeight = ref(0);

		const search = computed(() => store.state.messageSearchResults);
		const messages = computed(() => {
			if (!search.value) {
				return [];
			}

			return search.value.results;
		});

		const chan = computed(() => {
			const chanId = parseInt(route.params.id as string, 10);
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

		const doSearch = () => {
			offset.value = 0;
			store.commit("messageSearchInProgress", true);

			if (!offset.value) {
				store.commit("messageSearchInProgress", undefined); // Only reset if not getting offset
			}

			socket.emit("search", {
				networkUuid: network.value?.uuid,
				channelName: channel.value?.name,
				searchTerm: String(route.query.q),
				offset: offset.value,
			});
		};

		const onShowMoreClick = () => {
			if (!chatRef) {
				return;
			}

			offset.value += 100;
			store.commit("messageSearchInProgress", true);

			oldScrollTop.value = chatRef.scrollTop;
			oldChatHeight.value = chatRef.scrollHeight;

			socket.emit("search", {
				networkUuid: network.value?.uuid,
				channelName: channel.value?.name,
				searchTerm: String(route.query.q),
				offset: offset.value + 1,
			});
		};

		const jumpToBottom = () => {
			nextTick(() => {
				if (!chatRef) {
					return;
				}

				const el = chatRef;
				el.scrollTop = el.scrollHeight;
			}).catch((e) => {
				// eslint-disable-next-line no-console
				console.error(e);
			});
		};

		const jump = (message: ClientMessage, id: number) => {
			// TODO: Implement jumping to messages!
			// This is difficult because it means client will need to handle a potentially nonlinear message set
			// (loading IntersectionObserver both before AND after the messages)
			router
				.push({
					name: "MessageList",
					params: {
						id: channel.value?.id,
					},
					query: {
						focused: id,
					},
				})
				.catch((e) => {
					// eslint-disable-next-line no-console
					console.error(`Failed to navigate to message ${id}`, e);
				});
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

		watch(messages, () => {
			moreResultsAvailable.value = !!(
				messages.value.length && !(messages.value.length % 100)
			);

			if (!offset.value) {
				jumpToBottom();
			} else {
				nextTick(() => {
					if (!chatRef) {
						return;
					}

					const currentChatHeight = chatRef.scrollHeight;
					chatRef.scrollTop =
						oldScrollTop.value + currentChatHeight - oldChatHeight.value;
				}).catch((e) => {
					// eslint-disable-next-line no-console
					console.error("Failed to scroll to bottom", e);
				});
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
		});

		return {
			chat,
			loadMoreButton,
			messages,
			moreResultsAvailable,
			search,
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
