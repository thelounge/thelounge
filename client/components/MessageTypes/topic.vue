<template>
	<span class="content">
		<template v-if="message.from && message.from.nick"
			><Username :user="message.from" /> has changed the topic to:
		</template>
		<template v-else>The topic is: </template>
		<span v-if="message.text" class="new-topic"
			><ParsedMessage :network="network" :message="message"
		/></span>
	</span>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import type {ClientMessage, ClientNetwork} from "../../js/types";
import ParsedMessage from "../ParsedMessage.vue";
import Username from "../Username.vue";

export default defineComponent({
	name: "MessageTypeTopic",
	components: {
		ParsedMessage,
		Username,
	},
	props: {
		network: {
			type: Object as PropType<ClientNetwork>,
			required: true,
		},
		message: {
			type: Object as PropType<ClientMessage>,
			required: true,
		},
	},
});
</script>
