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

<script lang="ts">
import {defineComponent} from "vue";
import SidebarToggle from "../SidebarToggle.vue";
import Navigation from "../Settings/Navigation.vue";
import {useStore} from "../../js/store";

export default defineComponent({
	name: "Settings",
	components: {
		SidebarToggle,
		Navigation,
	},
	setup() {
		const store = useStore();

		const onChange = (event: Event) => {
			const ignore = ["old_password", "new_password", "verify_password"];

			const name = (event.target as HTMLInputElement).name;

			if (ignore.includes(name)) {
				return;
			}

			let value: boolean | string;

			if ((event.target as HTMLInputElement).type === "checkbox") {
				value = (event.target as HTMLInputElement).checked;
			} else {
				value = (event.target as HTMLInputElement).value;
			}

			void store.dispatch("settings/update", {name, value, sync: true});
		};

		return {
			onChange,
		};
	},
});
</script>
