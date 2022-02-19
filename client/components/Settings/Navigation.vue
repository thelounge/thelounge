<template>
	<div class="tabs">
		<h1 class="title">Settings</h1>

		<ul role="navigation" aria-label="Settings tabs">
			<SettingTabItem name="General" class-name="general" to="" />
			<SettingTabItem name="Appearance" class-name="appearance" to="appearance" />
			<SettingTabItem name="Notifications" class-name="notifications" to="notifications" />
			<SettingTabItem name="User Settings" class-name="user" to="user" />
		</ul>
	</div>
</template>

<style>
.tabs ul {
	padding: 0;
	border-radius: 5px;
}

.tabs li {
	font-size: 20px;
	list-style: none;
}

.tabs button {
	color: var(--body-color-muted);
	width: 100%;
	height: 100%;
	display: inline-block;
	text-align: left;
	margin: 8px 0;
	border-bottom: 1px solid var();
}

.tabs button::before {
	width: 20px;
	height: 20px;
	display: inline-block;
	content: "";
	margin-right: 10px;
}

.tabs .appearance::before {
	content: "\f1fc"; /* http://fontawesome.io/icon/paint-brush/ */
}

.tabs .user::before {
	content: "\f007"; /* http://fontawesome.io/icon/user/ */
}

.tabs .messages::before {
	content: "\f0e0"; /* http://fontawesome.io/icon/envelope/ */
}

.tabs .notifications::before {
	content: "\f0f3"; /* http://fontawesome.io/icon/bell/ */
}

.tabs .general::before {
	content: "\f013"; /* http://fontawesome.io/icon/cog/ */
}

.tabs button:hover,
.tabs button.active {
	color: #fff;
}

.tabs button:hover,
.tabs button:focus {
	background-color: rgb(48 62 74 / 50%); /* #303e4a x 50% alpha */
}

.tabs button.active {
	background-color: #303e4a;
	cursor: default;
}
</style>

<script>
import SettingTabItem from "./SettingTabItem.vue";

export default {
	name: "SettingsTabs",
	components: {
		SettingTabItem,
	},
};
</script>
