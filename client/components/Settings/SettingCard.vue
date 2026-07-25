<template>
	<div class="setting-card">
		<h2 :id="titleId" class="setting-card-title">{{ title }}</h2>
		<slot />
	</div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
	name: "SettingCard",
	props: {
		title: {type: String, required: true},
		titleId: {type: String, default: undefined},
	},
});
</script>
