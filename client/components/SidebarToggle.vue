<template>
	<button class="lt" aria-label="Toggle channel list" @click="$store.commit('toggleSidebar')" />
</template>

<style scoped>
/* Channel list button stays fixed when scrolling... */
.lt {
	position: fixed;
}

/* ... Except on chat windows, relative to include the notification dot */
.lt {
	position: relative;
}

/* Notification dot on the top right corner of the menu icon */
.lt::after {
	content: "";
	position: absolute;
	top: 9px;
	right: 7px;
	background-color: #e74c3c;
	width: 10px;
	height: 10px;
	border-radius: 50%;
	border: 2px solid var(--window-bg-color);
	opacity: 0;
	transition: opacity 0.2s;
	background-clip: padding-box; /* Fix border-radius bleeding color */
}

#viewport.notified .lt::after {
	opacity: 1;
}

@media (max-width: 768px) {
	/* On mobile display, channel list button stays at the top */
	#viewport .lt {
		position: relative;
	}
}
</style>

<script>
export default {
	name: "SidebarToggle",
};
</script>
