<template>
	<div
		:id="'msg-' + message.id"
		:class="['msg', message.type, {self: message.self, highlight: message.highlight}]"
		:data-from="message.from && message.from.nick"
	>
		<span
			:aria-label="message.time | localetime"
			class="time tooltipped tooltipped-e">{{ message.time | tz }}</span>
		<template v-if="message.type === 'unhandled'">
			<span class="from">[{{ message.command }}]</span>
			<span class="content">
				<span
					v-for="(param, id) in message.params"
					:key="id">{{ param }} </span>
			</span>
		</template>
		<template v-else-if="isAction()">
			<span class="from"/>
			<component
				:is="messageComponent"
				:message="message"/>
		</template>
		<template v-if="message.type === 'action'">
			<span class="from"/>
			<span class="content">
				<span class="text"><Username :user="message.from"/> <ParsedMessage :message="message"/></span>
				<LinkPreview
					v-for="preview in message.previews"
					:keep-scroll-position="keepScrollPosition"
					:key="preview.link"
					:link="preview"/>
			</span>
		</template>
		<template v-else>
			<span class="from">
				<template v-if="message.from && message.from.nick">
					<Username :user="message.from"/>
				</template>
			</span>
			<span class="content">
				<span class="text"><ParsedMessage :message="message"/></span>
				<LinkPreview
					v-for="preview in message.previews"
					:keep-scroll-position="keepScrollPosition"
					:key="preview.link"
					:link="preview"/>
			</span>
		</template>
	</div>
</template>

<script>
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
		keepScrollPosition: Function,
	},
	computed: {
		messageComponent() {
			return "message-" + this.message.type;
		},
	},
	mounted() {
		require("../js/renderPreview");
	},
	methods: {
		isAction() {
			return typeof MessageTypes["message-" + this.message.type] !== "undefined";
		},
	},
};
</script>
