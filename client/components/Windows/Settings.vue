<template>
	<div id="settings" class="window" role="tabpanel" aria-label="Settings">
		<div class="header">
			<SidebarToggle />
		</div>
		<form ref="settingsForm" class="container" @change="onChange" @submit.prevent>
			<div class="static">
				<h1 class="title">Settings - {{ $route.name }}</h1>

				<div>
					<label class="opt">
						<input
							:checked="$store.state.settings.advanced"
							type="checkbox"
							name="advanced"
						/>
						Advanced settings
					</label>
				</div>
			</div>

			<div class="subcontainer">
				<div class="tabs">
					<ul>
						<router-link
							to="/settings/main"
							tag="li"
							active-class="active"
							:class="['channel-list-item']"
							aria-label="Main Settings"
							role="tab"
							aria-controls="main"
							:aria-selected="$route.name === 'Main'"
							>Main</router-link
						>
						<router-link
							to="/settings/messages"
							tag="li"
							active-class="active"
							:class="['channel-list-item']"
							aria-label="Message Settings"
							role="tab"
							aria-controls="message"
							:aria-selected="$route.name === 'Messages'"
							>Messages</router-link
						>
						<router-link
							to="/settings/notifications"
							tag="li"
							active-class="active"
							:class="['channel-list-item']"
							aria-label="Notifications Settings"
							role="tab"
							aria-controls="notifications"
							:aria-selected="$route.name === 'Notifications'"
							>Notifications</router-link
						>
					</ul>
				</div>

				<router-view></router-view>
			</div>
		</form>
	</div>
</template>

<style>
.container {
	display: flex;
	flex-flow: column;
	width: 720px;
}

.static {
	padding-left: 230px;
}

.settings {
	width: 480px;
}

.subcontainer {
	display: flex;
	flex-flow: row;
}

.tabs {
	width: 240px;
}

.tabs ul {
	list-style: none;
	padding-top: 10px;
	padding-left: 0;
}
</style>

<script>
import SidebarToggle from "../SidebarToggle.vue";

export default {
	name: "Settings",
	components: {
		SidebarToggle,
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
