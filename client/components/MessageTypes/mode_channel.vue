<template>
	<span class="content">
		Channel mode is <b>{{ message.text }}</b>
	</span>
</template>

<script>
export default {
	name: "MessageChannelMode",
	props: {
		network: Object,
		message: Object,
	},
};
</script>
