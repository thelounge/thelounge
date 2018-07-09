<template v-elseif="message.type === 'message'">
	<span class="content">
		<Username :user="message.from"/>
		has kicked
		<Username :user="message.target"/>
		<i
			v-if="message.text"
			class="part-reason"
			v-html="'(' + $options.filters.parse(message.text) + ')'"/>
	</span>
</template>

<script>
import Username from "../Username.vue";

export default {
	name: "MessageTypeKick",
	components: {
		Username,
	},
	props: {
		message: Object,
	},
};
</script>
