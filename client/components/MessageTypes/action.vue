<template>
	<span class="content">
		<Username :user="message.from"/>
		<span
			ref="text"
			class="text"><ParsedMessage :message="message"/></span>
		<LinkPreview
			v-for="preview in message.previews"
			:key="preview.link"
			:link="preview"/>
	</span>
</template>

<script>
import ParsedMessage from "../ParsedMessage.vue";
import LinkPreview from "../LinkPreview.vue";
import Username from "../Username.vue";

export default {
	name: "MessageTypeAction",
	components: {
		ParsedMessage,
		LinkPreview,
		Username,
	},
	props: {
		message: Object,
	},
};
</script>
