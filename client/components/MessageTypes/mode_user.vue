<template>
	<span class="content">
		Your user mode is <b>{{ message.raw_modes }}</b>
	</span>
</template>

<script>
export default {
	name: "MessageChannelMode",
	props: {
		network: Object as PropType<ClientNetwork>,
		message: Object,
	},
};
</script>
