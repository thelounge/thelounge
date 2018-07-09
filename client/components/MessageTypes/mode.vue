<template v-elseif="message.type === 'message'">
	<span class="content">
		<Username :user="message.from"/>
		sets mode
		<span v-html="$options.filters.parse(message.text)"/>
	</span>
</template>

<script>
import Username from "../Username.vue";

export default {
	name: "MessageTypeMode",
	components: {
		Username,
	},
	props: {
		message: Object,
	},
};
</script>
