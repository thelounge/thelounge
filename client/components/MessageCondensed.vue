<template>
	<div class="msg condensed closed" ref="condensedContainer">
		<div class="condensed-summary">
			<span class="time"></span>
			<span class="from"></span>
			<span class="content">
				{{condensedText}}
				<button class="toggle-button" aria-label="Toggle status messages" @click="onExpandClick"></button>
			</span>
		</div>
		<Message
			v-for="message in messages"
			:message="message"
			:key="message.id"/>
	</div>
</template>

<script>
const constants = require("../js/constants");
import Message from "./Message.vue";

export default {
	name: "MessageCondensed",
	components: {
		Message
	},
	props: {
		messages: Array,
	},
	computed: {
		condensedText() {
			const obj = {};

			constants.condensedTypes.forEach((type) => {
				obj[type] = 0;
			});

			for (const message of this.messages) {
				obj[message.type]++;
			}

			// Count quits as parts in condensed messages to reduce information density
			obj.part += obj.quit;

			const strings = [];
			constants.condensedTypes.forEach((type) => {
				if (obj[type]) {
					switch (type) {
					case "away":
						strings.push(obj[type] + (obj[type] > 1 ? " users have gone away" : " user has gone away"));
						break;
					case "back":
						strings.push(obj[type] + (obj[type] > 1 ? " users have come back" : " user has come back"));
						break;
					case "chghost":
						strings.push(obj[type] + (obj[type] > 1 ? " users have changed hostname" : " user has changed hostname"));
						break;
					case "join":
						strings.push(obj[type] + (obj[type] > 1 ? " users have joined" : " user has joined"));
						break;
					case "part":
						strings.push(obj[type] + (obj[type] > 1 ? " users have left" : " user has left"));
						break;
					case "nick":
						strings.push(obj[type] + (obj[type] > 1 ? " users have changed nick" : " user has changed nick"));
						break;
					case "kick":
						strings.push(obj[type] + (obj[type] > 1 ? " users were kicked" : " user was kicked"));
						break;
					case "mode":
						strings.push(obj[type] + (obj[type] > 1 ? " modes were set" : " mode was set"));
						break;
					}
				}
			});

			let text = strings.pop();

			if (strings.length) {
				text = strings.join(", ") + ", and " + text;
			}

			return text;
		},
	},
	methods: {
		onExpandClick() {
			this.$refs.condensedContainer.classList.toggle("closed");
		},
	},
};
</script>
