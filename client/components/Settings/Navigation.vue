<template>
	<div class="tabs">
		<ul role="navigation" aria-label="Settings tabs">
			<SettingTabItem name="General" class-name="general" to="" />
			<SettingTabItem name="Appearance" class-name="appearance" to="appearance" />
			<SettingTabItem name="Notifications" class-name="notifications" to="notifications" />
			<SettingTabItem name="Account" class-name="account" to="account" />
		</ul>
	</div>
</template>

<style>
.tabs ul {
	padding: 0;
}

.tabs li {
	font-size: 18px;
	list-style: none;
}

.tabs button {
	color: var(--body-color-muted);
	width: 100%;
	height: 100%;
	display: inline-block;
	text-align: left;
}

.tabs li:not(:last-of-type) button {
	margin-bottom: 8px;
}

.tabs button::before {
	width: 18px;
	height: 18px;
	display: inline-block;
	content: "";
	margin-right: 8px;
}

.tabs .appearance::before {
	content: "\f108"; /* http://fontawesome.io/icon/desktop/ */
}

.tabs .account::before {
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
