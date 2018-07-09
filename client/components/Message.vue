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
					:key="id">{{ param }}</span>
			</span>
		</template>
		<template v-else-if="isAction()">
			<span class="from"/>
			<component
				:is="messageComponent"
				:message="message"/>
		</template>
		<template v-else>
			<span class="from">
				<template v-if="message.from && message.from.nick">
					<Username :user="message.from"/>
				</template>
			</span>
			<span class="content">
				<span
					class="text"
					v-html="$options.filters.parse(message.text, message.users)"/>

				<div
					v-for="preview in message.previews"
					:key="preview.link"
					:data-url="preview.link"
					class="preview"/>
			</span>
		</template>
	</div>
</template>

<script>
import Username from "./Username.vue";
import MessageTypes from "./MessageTypes";

MessageTypes.Username = Username;

export default {
	name: "Message",
	components: MessageTypes,
	props: {
		message: Object,
	},
	computed: {
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
