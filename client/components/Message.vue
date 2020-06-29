<template>
	<div
		:id="'msg-' + message.id"
		:class="[
			'msg',
			{self: message.self, highlight: message.highlight, 'previous-source': isPreviousSource},
		]"
		:data-type="message.type"
		:data-command="message.command"
		:data-from="message.from && message.from.nick"
	>
		<span :aria-label="messageTimeLocale" class="time tooltipped tooltipped-e"
			>{{ messageTime }}
		</span>
		<template v-if="message.type === 'unhandled'">
			<span class="from">[{{ message.command }}]</span>
			<span class="content">
				<span v-for="(param, id) in message.params" :key="id">{{ param }} </span>
			</span>
		</template>
		<template v-else-if="isAction()">
			<span class="from"><span class="only-copy">*** </span></span>
			<component :is="messageComponent" :network="network" :message="message" />
		</template>
		<template v-else-if="message.type === 'action'">
			<span class="from"><span class="only-copy">* </span></span>
			<span class="content" dir="auto">
				<Username :user="message.from" dir="auto" />&#32;<ParsedMessage
					:message="message"
				/>
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
					<span class="only-copy">&lt;</span>
					<Username :user="message.from" />
					<span class="only-copy">&gt; </span>
				</template>
			</span>
			<span v-else-if="message.type === 'plugin'" class="from">
				<template v-if="message.from && message.from.nick">
					<span class="only-copy">[</span>
					{{ message.from.nick }}
					<span class="only-copy">] </span>
				</template>
			</span>
			<span v-else class="from">
				<template v-if="message.from && message.from.nick">
					<span class="only-copy">-</span>
					<Username :user="message.from" />
					<span class="only-copy">- </span>
				</template>
			</span>
			<span class="content" dir="auto">
				<span
					v-if="message.showInActive"
					aria-label="This message was shown in your active channel"
					class="msg-shown-in-active tooltipped tooltipped-e"
					><span></span
				></span>
				<span
					v-if="message.statusmsgGroup"
					:aria-label="`This message was only shown to users with ${message.statusmsgGroup} mode`"
					class="msg-statusmsg tooltipped tooltipped-e"
					><span>{{ message.statusmsgGroup }}</span></span
				>
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
	</div>
</template>

<script>
const constants = require("../js/constants");
import localetime from "../js/helpers/localetime";
import dayjs from "dayjs";
import Username from "./Username.vue";
import LinkPreview from "./LinkPreview.vue";
import ParsedMessage from "./ParsedMessage.vue";
import MessageTypes from "./MessageTypes";

MessageTypes.ParsedMessage = ParsedMessage;
MessageTypes.LinkPreview = LinkPreview;
MessageTypes.Username = Username;

export default {
	name: "Message",
	components: MessageTypes,
	props: {
		message: Object,
		channel: Object,
		network: Object,
		keepScrollPosition: Function,
		isPreviousSource: Boolean,
	},
	computed: {
		timeFormat() {
			let format;

			if (this.$store.state.settings.use12hClock) {
				format = this.$store.state.settings.showSeconds ? "msg12hWithSeconds" : "msg12h";
			} else {
				format = this.$store.state.settings.showSeconds ? "msgWithSeconds" : "msgDefault";
			}

			return constants.timeFormats[format];
		},
		messageTime() {
			return dayjs(this.message.time).format(this.timeFormat);
		},
		messageTimeLocale() {
			return localetime(this.message.time);
		},
		messageComponent() {
			return "message-" + this.message.type;
		},
	},
	methods: {
		isAction() {
			return typeof MessageTypes["message-" + this.message.type] !== "undefined";
		},
	},
};
</script>
