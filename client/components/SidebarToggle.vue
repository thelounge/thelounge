<template>
	<button class="lt" aria-label="Toggle channel list" @click="store.commit('toggleSidebar')" />
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {useStore} from "../js/store";

export default defineComponent({
	name: "SidebarToggle",
	setup() {
		const store = useStore();

		return {
			store,
		};
	},
});
</script>
