<template v-elseif="message.type === 'message'">
	<span class="content">
		<template v-if="message.from && message.from.nick">
			<Username :user="message.from"/>
			has changed the topic to:
		</template>
		<template v-else>
			The topic is:
		</template>
		<span
			v-if="message.text"
			class="new-topic"
			v-html="$options.filters.parse(message.text)"/>
	</span>
</template>

<script>
import Username from "../Username.vue";

export default {
	name: "MessageTypeTopic",
	components: {
		Username,
	},
	props: {
		message: Object,
	},
};
</script>
