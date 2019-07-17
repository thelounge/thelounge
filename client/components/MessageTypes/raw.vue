<template>
	<span class="content">{{ message.text }}</span>
</template>

<script>
export default {
	name: "MessageTypeRaw",
	props: {
		network: Object,
		message: Object,
	},
};
</script>
