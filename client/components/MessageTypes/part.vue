<template v-elseif="message.type === 'message'">
	<span class="content">
		<Username :user="message.from"/>
		<i class="hostmask">({{ message.hostmask }})</i>
		has left the channel
		<i
			v-if="message.text"
			class="part-reason"
			v-html="'(' + $options.filters.parse(message.text) + ')'"/>
	</span>
</template>

<script>
import Username from "../Username.vue";

export default {
	name: "MessageTypePart",
	components: {
		Username,
	},
	props: {
		message: Object,
	},
};
</script>
