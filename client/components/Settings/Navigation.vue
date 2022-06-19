<template>
	<!-- 220px is the width of the sidebar, and we add 100px to allow for the text -->
	<aside class="settings-menu">
		<h2>Settings</h2>
		<ul role="navigation" aria-label="Settings tabs">
			<SettingTabItem name="General" class-name="general" to="" />
			<SettingTabItem name="Appearance" class-name="appearance" to="appearance" />
			<SettingTabItem name="Notifications" class-name="notifications" to="notifications" />
			<SettingTabItem name="Account" class-name="account" to="account" />
		</ul>
	</aside>
</template>

<style>
.settings-menu {
	position: fixed;
	/* top: Header + (padding bottom of h2 - border) */
	top: calc(45px + 5px);
	/* Mid page minus width of container and 30 pixels for padding */
	margin-left: calc(50% - 480px - 30px);
}

/** The calculation is mobile +  2/3 of container width. Fairly arbitrary. */
@media screen and (max-width: calc(768px + 320px)) {
	.settings-menu {
		position: static;
		width: min(480px, 100%);
		align-self: center;
		margin: 0 auto;
		padding: 0 15px;
	}
}

.settings-menu ul {
	padding: 0;
}

.settings-menu li {
	font-size: 18px;
	list-style: none;
}

.settings-menu button {
	color: var(--body-color-muted);
	width: 100%;
	height: 100%;
	display: inline-block;
	text-align: left;
}

.settings-menu li:not(:last-of-type) button {
	margin-bottom: 8px;
}

.settings-menu button::before {
	width: 18px;
	height: 18px;
	display: inline-block;
	content: "";
	margin-right: 8px;
}

.settings-menu .appearance::before {
	content: "\f108"; /* http://fontawesome.io/icon/desktop/ */
}

.settings-menu .account::before {
	content: "\f007"; /* http://fontawesome.io/icon/user/ */
}

.settings-menu .messages::before {
	content: "\f0e0"; /* http://fontawesome.io/icon/envelope/ */
}

.settings-menu .notifications::before {
	content: "\f0f3"; /* http://fontawesome.io/icon/bell/ */
}

.settings-menu .general::before {
	content: "\f013"; /* http://fontawesome.io/icon/cog/ */
}

.settings-menu button:hover,
.settings-menu button.active {
	color: var(--body-color);
}

.settings-menu button.active {
	cursor: default;
}
</style>

<script lang="ts">
import SettingTabItem from "./SettingTabItem.vue";
import {defineComponent} from "vue";

export default defineComponent({
	name: "SettingsTabs",
	components: {
		SettingTabItem,
	},
});
</script>
