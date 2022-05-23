<template>
	<button class="lt" aria-label="Toggle channel list" @click="$store.commit('toggleSidebar')" />
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
	name: "SidebarToggle",
});
</script>
