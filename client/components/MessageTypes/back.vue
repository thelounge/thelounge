<template v-elseif="message.type === 'message'">
	<span class="content">
		<template v-if="message.self">
			<i v-html="$options.filters.parse(message.text)"/>
		</template>
		<template v-else>
			<Username :user="message.from"/>
			is back
		</template>
	</span>
</template>

<script>
import Username from "../Username.vue";

export default {
	name: "MessageTypeBack",
	components: {
		Username,
	},
	props: {
		message: Object,
	},
};
</script>
