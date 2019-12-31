<template>
	<div id="chat-container" class="window">
		<div
			id="chat"
			:class="{
				'colored-nicks': $store.state.settings.coloredNicks,
				'show-seconds': $store.state.settings.showSeconds,
			}"
		>
			<div
				class="chat-view"
				data-type="search-results"
				aria-label="Search results"
				role="tabpanel"
			>
				<div class="header">
					<SidebarToggle />
					<span class="title"
						>Search results for "{{ $route.params.term }}" in
						{{ $route.params.target }}</span
					>
					<span class="topic"></span>
					<MessageSearchForm :network="network" :channel="channel" />
				</div>
				<div class="chat-content">
					<div ref="chat" class="chat" tabindex="-1">
						<div v-show="moreResultsAvailable" class="show-more">
							<button
								ref="loadMoreButton"
								:disabled="
									$store.state.messageSearchInProgress ||
										!$store.state.isConnected
								"
								class="btn"
								@click="onShowMoreClick"
							>
								<span v-if="$store.state.messageSearchInProgress">Loading…</span>
								<span v-else>Show older messages</span>
							</button>
						</div>

						<div v-if="$store.state.messageSearchInProgress" class="search-status">
							Searching...
						</div>
						<div v-else-if="!messages.length" class="search-status">
							No results found.
						</div>
						<div
							v-else
							class="messages"
							role="log"
							aria-live="polite"
							aria-relevant="additions"
						>
							<template v-for="(message, id) in messages">
								<DateMarker
									v-if="shouldDisplayDateMarker(message, id)"
									:key="message.time + '-date'"
									:message="message"
								/>
								<Message
									:key="message.time"
									:channel="channel"
									:network="network"
									:message="message"
								/>
							</template>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import socket from "../../js/socket";

import SidebarToggle from "../SidebarToggle.vue";
import Message from "../Message.vue";
import MessageSearchForm from "../MessageSearchForm.vue";
import DateMarker from "../DateMarker.vue";

export default {
	name: "SearchResults",
	components: {
		SidebarToggle,
		Message,
		DateMarker,
		MessageSearchForm,
	},
	data() {
		return {
			offset: 0,
			moreResultsAvailable: false,
		};
	},
	computed: {
		search() {
			return this.$store.state.messageSearchResults;
		},
		messages() {
			if (!this.search) {
				return [];
			}

			return this.search.results.slice().reverse();
		},
		chan() {
			if (!this.search) {
				return;
			}

			const chan = this.$store.getters.findChannelOnNetwork(
				this.search.networkUuid,
				this.search.target
			);
			return chan;
		},
		network() {
			if (!this.chan) {
				return null;
			}

			return this.chan.network;
		},
		channel() {
			if (!this.chan) {
				return null;
			}

			return this.chan.channel;
		},
	},
	watch: {
		"$route.params.uuid"() {
			this.doSearch();
		},
		"$route.params.target"() {
			this.doSearch();
		},
		"$route.params.term"() {
			this.doSearch();
		},
		messages() {
			this.moreResultsAvailable = this.messages.length && !(this.messages.length % 100);
			this.jumpToBottom();
		},
	},
	mounted() {
		this.doSearch();
	},
	methods: {
		shouldDisplayDateMarker(message, id) {
			const previousMessage = this.messages[id - 1];

			if (!previousMessage) {
				return true;
			}

			return new Date(previousMessage.time).getDay() !== new Date(message.time).getDay();
		},
		doSearch() {
			this.offset = 0;
			this.$store.commit("messageSearchInProgress", true);
			this.$store.commit("messageSearchResults", null); // Only reset if not getting offset
			socket.emit("search", {
				networkUuid: this.$route.params.uuid,
				channelName: this.$route.params.target,
				searchTerm: this.$route.params.term,
				offset: this.offset,
			});
		},
		onShowMoreClick() {
			this.offset += 100;
			this.$store.commit("messageSearchInProgress", true);
			socket.emit("search", {
				networkUuid: this.$route.params.uuid,
				channelName: this.$route.params.target,
				searchTerm: this.$route.params.term,
				offset: this.offset,
			});
		},
		jumpToBottom() {
			this.$nextTick(() => {
				const el = this.$refs.chat;
				el.scrollTop = el.scrollHeight;
			});
		},
	},
};
</script>
