<template>
	<span class="content">
		Topic set by
		<Username :user="message.from" />
		on {{ messageTimeLocale }}
	</span>
</template>

<script>
import localetime from "../../js/helpers/localetime";
import Username from "../Username.vue";

export default {
	name: "MessageTypeTopicSetBy",
	components: {
		Username,
	},
	props: {
		network: Object,
		message: Object,
	},
	computed: {
		messageTimeLocale() {
			return localetime(this.message.when);
		},
	},
};
</script>
