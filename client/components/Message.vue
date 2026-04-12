<template>
	<div
		:id="'msg-' + message.id"
		:class="[
			'msg',
			{
				self: message.self,
				highlight: message.highlight || focused,
				'previous-source': isPreviousSource,
			},
		]"
		:data-type="message.type"
		:data-command="message.command"
		:data-from="message.from && message.from.nick"
		:data-msgid="message.msgid"
		@touchstart.passive="onTouchStart"
		@touchend="onTouchEnd"
		@touchmove="onTouchCancel"
		@touchcancel="onTouchCancel"
	>
		<span
			aria-hidden="true"
			:aria-label="messageTimeLocale"
			class="time tooltipped tooltipped-e"
			>{{ `${messageTime}&#32;` }}
		</span>
		<template v-if="message.type === 'unhandled'">
			<span class="from">[{{ message.command }}]</span>
			<span class="content">
				<span v-for="(param, id) in message.params" :key="id">{{
					`&#32;${param}&#32;`
				}}</span>
			</span>
		</template>
		<template v-else-if="isAction()">
			<span class="from"><span class="only-copy" aria-hidden="true">***&nbsp;</span></span>
			<component :is="messageComponent" :network="network" :message="message" />
		</template>
		<template v-else-if="message.type === 'action'">
			<span class="from"><span class="only-copy">*&nbsp;</span></span>
			<span class="content" dir="auto">
				<div
					v-if="message.replyTo"
					class="reply-context"
					role="button"
					tabindex="0"
					@click="scrollToParent"
					@keydown.enter.prevent="scrollToParent"
					@keydown.space.prevent="scrollToParent"
				>
					<template v-if="message.replyToNick">
						<span class="reply-context-nick">{{ message.replyToNick }}</span>
						<span v-if="message.replyToText" class="reply-context-text">{{
							message.replyToText
						}}</span>
					</template>
					<span v-else class="reply-context-unknown">In reply to a message</span>
				</div>
				<StatusmsgMarker :group="message.statusmsgGroup" />
				<Username
					:user="message.from"
					:network="network"
					:channel="channel"
					dir="auto"
				/>&#32;<ParsedMessage :message="message" />
				<LinkPreview
					v-for="preview in message.previews"
					:key="preview.link"
					:keep-scroll-position="keepScrollPosition"
					:link="preview"
					:channel="channel"
				/>
			</span>
		</template>
		<template v-else>
			<span v-if="message.type === 'message'" class="from">
				<template v-if="message.from && message.from.nick">
					<span class="only-copy" aria-hidden="true">&lt;</span>
					<Username :user="message.from" :network="network" :channel="channel" />
					<span class="only-copy" aria-hidden="true">&gt;&nbsp;</span>
				</template>
			</span>
			<span v-else-if="message.type === 'plugin'" class="from">
				<template v-if="message.from && message.from.nick">
					<span class="only-copy" aria-hidden="true">[</span>
					{{ message.from.nick }}
					<span class="only-copy" aria-hidden="true">]&nbsp;</span>
				</template>
			</span>
			<span v-else class="from">
				<template v-if="message.from && message.from.nick">
					<span class="only-copy" aria-hidden="true">-</span>
					<Username :user="message.from" :network="network" :channel="channel" />
					<span class="only-copy" aria-hidden="true">-&nbsp;</span>
				</template>
			</span>
			<span class="content" dir="auto">
				<div
					v-if="message.replyTo"
					class="reply-context"
					role="button"
					tabindex="0"
					@click="scrollToParent"
					@keydown.enter.prevent="scrollToParent"
					@keydown.space.prevent="scrollToParent"
				>
					<template v-if="message.replyToNick">
						<span class="reply-context-nick">{{ message.replyToNick }}</span>
						<span v-if="message.replyToText" class="reply-context-text">{{
							message.replyToText
						}}</span>
					</template>
					<span v-else class="reply-context-unknown">In reply to a message</span>
				</div>
				<span
					v-if="message.showInActive"
					aria-label="This message was shown in your active channel"
					class="msg-shown-in-active tooltipped tooltipped-e"
					><span></span
				></span>
				<StatusmsgMarker :group="message.statusmsgGroup" />
				<ParsedMessage :network="network" :message="message" />
				<LinkPreview
					v-for="preview in message.previews"
					:key="preview.link"
					:keep-scroll-position="keepScrollPosition"
					:link="preview"
					:channel="channel"
				/>
			</span>
		</template>
		<div v-if="canReply && message.msgid" class="msg-actions">
			<button class="msg-action-reply" aria-label="Reply" @click.stop="startReply" />
		</div>
	</div>
</template>

<script lang="ts">
import {computed, defineComponent, onBeforeUnmount, PropType} from "vue";
import dayjs from "dayjs";

import constants from "../js/constants";
import localetime from "../js/helpers/localetime";
import eventbus from "../js/eventbus";
import Username from "./Username.vue";
import LinkPreview from "./LinkPreview.vue";
import ParsedMessage from "./ParsedMessage.vue";
import MessageTypes from "./MessageTypes";
import StatusmsgMarker from "./StatusmsgMarker.vue";

import type {ClientChan, ClientMessage, ClientNetwork} from "../js/types";
import {MessageType} from "../../shared/types/msg";
import {useStore} from "../js/store";

MessageTypes.ParsedMessage = ParsedMessage;
MessageTypes.LinkPreview = LinkPreview;
MessageTypes.Username = Username;

export default defineComponent({
	name: "Message",
	components: {
		...MessageTypes,
		StatusmsgMarker,
	},
	props: {
		message: {type: Object as PropType<ClientMessage>, required: true},
		channel: {type: Object as PropType<ClientChan>, required: false},
		network: {type: Object as PropType<ClientNetwork>, required: true},
		keepScrollPosition: Function as PropType<() => void>,
		isPreviousSource: Boolean,
		focused: Boolean,
	},
	setup(props) {
		const store = useStore();
		let longPressTimer: ReturnType<typeof setTimeout> | null = null;

		const timeFormat = computed(() => {
			let format: keyof typeof constants.timeFormats;

			if (store.state.settings.use12hClock) {
				format = store.state.settings.showSeconds ? "msg12hWithSeconds" : "msg12h";
			} else {
				format = store.state.settings.showSeconds ? "msgWithSeconds" : "msgDefault";
			}

			return constants.timeFormats[format];
		});

		const messageTime = computed(() => {
			return dayjs(props.message.time).format(timeFormat.value);
		});

		const messageTimeLocale = computed(() => {
			return localetime(props.message.time);
		});

		const messageComponent = computed(() => {
			return "message-" + (props.message.type || "invalid"); // TODO: force existence of type in sharedmsg
		});

		const canReply = computed(() => {
			const t = props.message.type;
			return (
				t === MessageType.MESSAGE || t === MessageType.ACTION || t === MessageType.NOTICE
			);
		});

		const isAction = () => {
			if (!props.message.type) {
				return false;
			}

			return typeof MessageTypes["message-" + props.message.type] !== "undefined";
		};

		const startReply = () => {
			eventbus.emit("reply:start", {
				msgid: props.message.msgid,
				nick: props.message.from?.nick,
				text: props.message.text,
			});
		};

		const scrollToParent = () => {
			if (!props.message.replyTo) {
				return;
			}

			const el = document.querySelector(
				`.msg[data-msgid="${CSS.escape(props.message.replyTo)}"]`
			);

			if (el) {
				const wasHighlighted = el.classList.contains("highlight");

				el.scrollIntoView({block: "center", behavior: "smooth"});
				el.classList.add("highlight");
				setTimeout(() => {
					if (!wasHighlighted) {
						el.classList.remove("highlight");
					}
				}, 2000);
			}
		};

		const onTouchStart = () => {
			if (props.message.msgid && canReply.value) {
				longPressTimer = setTimeout(() => {
					longPressTimer = null;
					startReply();
				}, 500);
			}
		};

		const clearLongPress = () => {
			if (longPressTimer !== null) {
				clearTimeout(longPressTimer);
				longPressTimer = null;
			}
		};

		const onTouchEnd = (e: TouchEvent) => {
			if (longPressTimer === null && props.message.msgid && canReply.value) {
				e.preventDefault();
			}

			clearLongPress();
		};

		const onTouchCancel = () => {
			clearLongPress();
		};

		onBeforeUnmount(() => {
			clearLongPress();
		});

		return {
			timeFormat,
			messageTime,
			messageTimeLocale,
			messageComponent,
			canReply,
			isAction,
			startReply,
			scrollToParent,
			onTouchStart,
			onTouchEnd,
			onTouchCancel,
		};
	},
});
</script>
