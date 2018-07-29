<template>
	<span class="content">
		Topic set by
		<Username :user="message.from" />
		on {{ message.when | localetime }}
	</span>
</template>

<script>
import Username from "../Username.vue";

export default {
	name: "MessageTypeTopicSetBy",
	components: {
		Username,
	},
	props: {
		message: Object,
	},
};
</script>
