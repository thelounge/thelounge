<template>
	<span
		v-if="group"
		:aria-label="`This message was only shown to users with ${group} mode`"
		class="msg-statusmsg tooltipped tooltipped-e"
		><span>{{ group }}</span></span
	>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
	name: "StatusmsgMarker",
	props: {
		group: {type: String, required: true},
	},
});
</script>
