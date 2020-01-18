<template>
	<button class="lt" aria-label="Toggle channel list" @click="$store.commit('toggleSidebar')" />
</template>

<script>
export default {
	name: "SidebarToggle",
};
</script>
