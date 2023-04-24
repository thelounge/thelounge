<template>
	<div id="chat-container" class="window" :data-current-channel="channel.name" lang="">
		<div
			id="chat"
			:class="{
				'hide-motd': !store.state.settings.motd,
				'time-seconds': store.state.settings.showSeconds,
				'time-12h': store.state.settings.use12hClock,
				'colored-nicks': true, // TODO temporarily fixes themes, to be removed in next major version
			}"
		>
			<div
				:id="'chan-' + channel.id"
				class="chat-view"
				:data-type="channel.type"
				:aria-label="channel.name"
				role="tabpanel"
			>
				<div class="header">
					<SidebarToggle />
					<span class="title" :aria-label="'Currently open ' + channel.type">{{
						channel.name
					}}</span>
					<div v-if="channel.editTopic === true" class="topic-container">
						<input
							ref="topicInput"
							:value="channel.topic"
							class="topic-input"
							placeholder="Set channel topic"
							enterkeyhint="done"
							@keyup.enter="saveTopic"
							@keyup.esc="channel.editTopic = false"
						/>
						<span aria-label="Save topic" class="save-topic" @click="saveTopic">
							<span type="button" aria-label="Save topic"></span>
						</span>
					</div>
					<span
						v-else
						:title="channel.topic"
						:class="{topic: true, empty: !channel.topic}"
						@dblclick="editTopic"
						><ParsedMessage
							v-if="channel.topic"
							:network="network"
							:text="channel.topic"
					/></span>
					<MessageSearchForm
						v-if="
							store.state.settings.searchEnabled &&
							['channel', 'query'].includes(channel.type)
						"
						:network="network"
						:channel="channel"
					/>
					<button
						class="mentions"
						aria-label="Open your mentions"
						@click="openMentions"
					/>
					<button
						class="menu"
						aria-label="Open the context menu"
						@click="openContextMenu"
					/>
					<span
						v-if="channel.type === 'channel'"
						class="rt-tooltip tooltipped tooltipped-w"
						aria-label="Toggle user list"
					>
						<button
							class="rt"
							aria-label="Toggle user list"
							@click="store.commit('toggleUserlist')"
						/>
					</span>
				</div>
				<div v-if="channel.type === 'special'" class="chat-content">
					<div class="chat">
						<div class="messages">
							<div class="msg">
								<component
									:is="specialComponent"
									:network="network"
									:channel="channel"
								/>
							</div>
						</div>
					</div>
				</div>
				<div v-else class="chat-content">
					<div
						:class="[
							'scroll-down tooltipped tooltipped-w tooltipped-no-touch',
							{'scroll-down-shown': !channel.scrolledToBottom},
						]"
						aria-label="Jump to recent messages"
						@click="messageList?.jumpToBottom()"
					>
						<div class="scroll-down-arrow" />
					</div>
					<ChatUserList v-if="channel.type === 'channel'" :channel="channel" />
					<MessageList
						ref="messageList"
						:network="network"
						:channel="channel"
						:focused="focused"
					/>
				</div>
			</div>
		</div>
		<div
			v-if="store.state.currentUserVisibleError"
			id="user-visible-error"
			@click="hideUserVisibleError"
		>
			{{ store.state.currentUserVisibleError }}
		</div>
		<ChatInput :network="network" :channel="channel" />
	</div>
</template>

<script lang="ts">
import socket from "../js/socket";
import eventbus from "../js/eventbus";
import ParsedMessage from "./ParsedMessage.vue";
import MessageList from "./MessageList.vue";
import ChatInput from "./ChatInput.vue";
import ChatUserList from "./ChatUserList.vue";
import SidebarToggle from "./SidebarToggle.vue";
import MessageSearchForm from "./MessageSearchForm.vue";
import ListBans from "./Special/ListBans.vue";
import ListInvites from "./Special/ListInvites.vue";
import ListChannels from "./Special/ListChannels.vue";
import ListIgnored from "./Special/ListIgnored.vue";
import {defineComponent, PropType, ref, computed, watch, nextTick, onMounted, Component} from "vue";
import type {ClientNetwork, ClientChan} from "../js/types";
import {useStore} from "../js/store";

export default defineComponent({
	name: "Chat",
	components: {
		ParsedMessage,
		MessageList,
		ChatInput,
		ChatUserList,
		SidebarToggle,
		MessageSearchForm,
	},
	props: {
		network: {type: Object as PropType<ClientNetwork>, required: true},
		channel: {type: Object as PropType<ClientChan>, required: true},
		focused: Number,
	},
	emits: ["channel-changed"],
	setup(props, {emit}) {
		const store = useStore();

		const messageList = ref<typeof MessageList>();
		const topicInput = ref<HTMLInputElement | null>(null);

		const specialComponent = computed(() => {
			switch (props.channel.special) {
				case "list_bans":
					return ListBans as Component;
				case "list_invites":
					return ListInvites as Component;
				case "list_channels":
					return ListChannels as Component;
				case "list_ignored":
					return ListIgnored as Component;
			}

			return undefined;
		});

		const channelChanged = () => {
			// Triggered when active channel is set or changed
			emit("channel-changed", props.channel);

			socket.emit("open", props.channel.id);

			if (props.channel.usersOutdated) {
				props.channel.usersOutdated = false;

				socket.emit("names", {
					target: props.channel.id,
				});
			}
		};

		const hideUserVisibleError = () => {
			store.commit("currentUserVisibleError", null);
		};

		const editTopic = () => {
			if (props.channel.type === "channel") {
				props.channel.editTopic = true;
			}
		};

		const saveTopic = () => {
			props.channel.editTopic = false;

			if (!topicInput.value) {
				return;
			}

			const newTopic = topicInput.value.value;

			if (props.channel.topic !== newTopic) {
				const target = props.channel.id;
				const text = `/raw TOPIC ${props.channel.name} :${newTopic}`;
				socket.emit("input", {target, text});
			}
		};

		const openContextMenu = (event: any) => {
			eventbus.emit("contextmenu:channel", {
				event: event,
				channel: props.channel,
				network: props.network,
			});
		};

		const openMentions = (event: any) => {
			eventbus.emit("mentions:toggle", {
				event: event,
			});
		};

		watch(
			() => props.channel,
			() => {
				channelChanged();
			}
		);

		watch(
			() => props.channel.editTopic,
			(newTopic) => {
				if (newTopic) {
					void nextTick(() => {
						topicInput.value?.focus();
					});
				}
			}
		);

		onMounted(() => {
			channelChanged();

			if (props.channel.editTopic) {
				void nextTick(() => {
					topicInput.value?.focus();
				});
			}
		});

		return {
			store,
			messageList,
			topicInput,
			specialComponent,
			hideUserVisibleError,
			editTopic,
			saveTopic,
			openContextMenu,
			openMentions,
		};
	},
});
</script>
