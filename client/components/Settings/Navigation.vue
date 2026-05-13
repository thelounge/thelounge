<template>
	<!-- 220px is the width of the sidebar, and we add 100px to allow for the text -->
	<aside class="settings-menu" :class="{'menu-open': menuOpen}">
		<h2>Settings</h2>
		<button
			class="settings-menu-toggle icon"
			:class="currentClassName"
			type="button"
			:aria-expanded="menuOpen"
			aria-controls="settings-menu-list"
			@click="menuOpen = !menuOpen"
		>
			<span class="settings-menu-toggle-label">{{ currentName }}</span>
			<span class="settings-menu-toggle-chevron" aria-hidden="true">▾</span>
		</button>
		<ul id="settings-menu-list" role="navigation" aria-label="Settings tabs">
			<SettingTabItem name="Appearance" class-name="appearance" to="" />
			<SettingTabItem name="Notifications" class-name="notifications" to="notifications" />
			<SettingTabItem v-if="showGeneral" name="General" class-name="general" to="general" />
			<SettingTabItem v-if="!isPublic" name="Account" class-name="account" to="account" />
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

/* Other sessions have a `<p>` for their last used date below them; current-session does not. */
.current-session .session-item-btn {
	margin-top: 10px;
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

.settings-menu .settings-menu-toggle {
	display: none;
}

@media screen and (max-width: 768px) {
	.settings-menu {
		position: static;
		width: min(480px, 100%);
		align-self: center;
		margin: 0 auto 12px;
		padding: 0 15px;
	}

	.settings-menu > h2 {
		display: none;
	}

	.settings-menu .settings-menu-toggle {
		position: relative;
		display: flex;
		align-items: center;
		gap: 8px;
		width: 100%;
		padding: 10px 14px;
		border: 1px solid color-mix(in srgb, var(--body-color) 12%, var(--window-bg-color));
		border-radius: 8px;
		background-color: var(--window-bg-color);
		color: var(--body-color);
		font-size: 15px;
		font-weight: 500;
		text-align: left;
	}

	.settings-menu-toggle::before {
		width: 18px;
		height: 18px;
		display: inline-block;
		content: "";
	}

	.settings-menu-toggle-label {
		flex: 1;
		margin-right: 6px;
	}

	.settings-menu-toggle-chevron {
		font-size: 18px;
		line-height: 1;
		color: var(--body-color-muted);
		transition: transform 0.15s;
	}

	.settings-menu.menu-open .settings-menu-toggle-chevron {
		transform: rotate(180deg);
	}

	.settings-menu ul {
		display: none;
		position: absolute;
		left: 15px;
		right: 15px;
		margin-top: 4px;
		padding: 4px;
		background-color: var(--window-bg-color);
		border: 1px solid color-mix(in srgb, var(--body-color) 12%, var(--window-bg-color));
		border-radius: 8px;
		box-shadow: 0 4px 12px rgb(0 0 0 / 8%);
		z-index: 10;
	}

	.settings-menu.menu-open ul {
		display: block;
	}

	.settings-menu li {
		font-size: 13px;
	}

	.settings-menu li:not(:last-of-type) button {
		margin-bottom: 2px;
	}

	.settings-menu li button {
		padding: 6px 8px;
		border-radius: 6px;
	}

	.settings-menu li button::before {
		width: 14px;
		height: 14px;
		margin-right: 6px;
	}

	.settings-menu li button.active {
		background-color: color-mix(in srgb, var(--button-color) 25%, transparent);
		color: var(--body-color);
	}
}
</style>

<script lang="ts">
import SettingTabItem from "./SettingTabItem.vue";
import {computed, defineComponent, ref, watch} from "vue";
import {useRoute} from "vue-router";
import {useStore} from "../../js/store";
import {shouldShowGeneralSettings} from "../../js/helpers/settingsTabs";

type Section = {name: string; className: string; to: string};

export default defineComponent({
	name: "SettingsTabs",
	components: {
		SettingTabItem,
	},
	setup() {
		const store = useStore();
		const route = useRoute();
		const isPublic = store.state.serverConfiguration?.public;
		const showGeneral = shouldShowGeneralSettings();

		const menuOpen = ref(false);

		const sections = computed<Section[]>(() => {
			const all: Section[] = [
				{name: "Appearance", className: "appearance", to: ""},
				{name: "Notifications", className: "notifications", to: "notifications"},
			];

			if (showGeneral) {
				all.push({name: "General", className: "general", to: "general"});
			}

			if (!isPublic) {
				all.push({name: "Account", className: "account", to: "account"});
			}

			return all;
		});

		const currentSection = computed<Section>(() => {
			const sub = (route.path.split("/settings/")[1] ?? "").replace(/\/$/, "");
			return sections.value.find((s) => s.to === sub) ?? sections.value[0];
		});

		const currentName = computed(() => currentSection.value.name);
		const currentClassName = computed(() => currentSection.value.className);

		watch(
			() => route.path,
			() => {
				menuOpen.value = false;
			}
		);

		return {
			isPublic,
			showGeneral,
			menuOpen,
			currentName,
			currentClassName,
		};
	},
});
</script>
