<template>
	<div id="settings" class="window" role="tabpanel" aria-label="Settings">
		<div class="header">
			<SidebarToggle />
		</div>
		<Navigation />

		<div class="container">
			<form ref="settingsForm" autocomplete="off" @change="onChange" @submit.prevent>
				<router-view></router-view>
			</form>
		</div>
	</div>
</template>

<script>
import SidebarToggle from "../SidebarToggle.vue";
import Navigation from "../Settings/Navigation.vue";

export default {
	name: "Settings",
	components: {
		SidebarToggle,
		Navigation,
	},
	methods: {
		onChange(event) {
			const ignore = ["old_password", "new_password", "verify_password"];

			const name = event.target.name;

			if (ignore.includes(name)) {
				return;
			}

			let value;

			if (event.target.type === "checkbox") {
				value = event.target.checked;
			} else {
				value = event.target.value;
			}

			this.$store.dispatch("settings/update", {name, value, sync: true});
		},
	},
};
</script>
