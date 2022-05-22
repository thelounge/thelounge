<template>
	<span class="content">{{ message.text }}</span>
</template>

<script>
export default {
	name: "MessageTypeRaw",
	props: {
		network: Object as PropType<ClientNetwork>,
		message: Object,
	},
};
</script>
