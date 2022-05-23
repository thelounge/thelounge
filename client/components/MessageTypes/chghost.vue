<template>
	<span class="content">
		<Username :user="message.from" />
		has changed
		<span v-if="message.new_ident"
			>username to <b>{{ message.new_ident }}</b></span
		>
		<span v-if="message.new_host"
			>hostname to
			<i class="hostmask"><ParsedMessage :network="network" :text="message.new_host" /></i
		></span>
	</span>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import {ClientNetwork, ClientMessage} from "../../js/types";
import ParsedMessage from "../ParsedMessage.vue";
import Username from "../Username.vue";

export default defineComponent({
	name: "MessageTypeChangeHost",
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
