<template>
	<div>
		<!-- Theme -->
		<div class="setting-card">
			<h2 class="setting-card-title">Theme</h2>
			<div>
				<label for="theme-select" class="sr-only">Theme</label>
				<select
					id="theme-select"
					:value="store.state.settings.theme"
					name="theme"
					class="input"
				>
					<option
						v-for="theme in store.state.serverConfiguration?.themes"
						:key="theme.name"
						:value="theme.name"
					>
						{{ theme.displayName }}
					</option>
				</select>
			</div>
		</div>

		<!-- Messages -->
		<div class="setting-card">
			<h2 class="setting-card-title">Messages</h2>
			<SettingToggle
				name="motd"
				label="Show MOTD"
				description="Display the server's Message of the Day when connecting"
				:checked="store.state.settings.motd"
			/>
			<SettingToggle
				name="showSeconds"
				label="Include seconds in timestamps"
				description="Show seconds alongside hours and minutes in message timestamps"
				:checked="store.state.settings.showSeconds"
			/>
			<SettingToggle
				name="use12hClock"
				label="Use 12-hour clock"
				description="Display timestamps in 12-hour format instead of 24-hour"
				:checked="store.state.settings.use12hClock"
			/>
		</div>

		<!-- Link previews -->
		<div v-if="store.state.serverConfiguration?.prefetch" class="setting-card">
			<h2 class="setting-card-title">Link previews</h2>
			<SettingToggle
				name="media"
				label="Auto-expand media"
				description="Automatically show inline previews for images and videos"
				:checked="store.state.settings.media"
			/>
			<SettingToggle
				name="links"
				label="Auto-expand websites"
				description="Automatically show link previews for URLs"
				:checked="store.state.settings.links"
			/>
		</div>

		<!-- Status messages -->
		<div class="setting-card">
			<h2 id="label-status-messages" class="setting-card-title">Status messages</h2>
			<div class="setting-row-description" style="margin-bottom: 4px">
				Control how joins, parts, quits, kicks, nick changes, and mode changes appear
			</div>
			<div class="setting-radio-pills" role="group" aria-labelledby="label-status-messages">
				<label class="setting-radio-pill">
					<input
						:checked="store.state.settings.statusMessages === 'shown'"
						type="radio"
						name="statusMessages"
						value="shown"
					/>
					<span class="pill-label">Show</span>
				</label>
				<label class="setting-radio-pill">
					<input
						:checked="store.state.settings.statusMessages === 'condensed'"
						type="radio"
						name="statusMessages"
						value="condensed"
					/>
					<span class="pill-label">Condense</span>
				</label>
				<label class="setting-radio-pill">
					<input
						:checked="store.state.settings.statusMessages === 'hidden'"
						type="radio"
						name="statusMessages"
						value="hidden"
					/>
					<span class="pill-label">Hide</span>
				</label>
			</div>
		</div>

		<!-- Visual aids -->
		<div class="setting-card">
			<h2 class="setting-card-title">Visual aids</h2>
			<SettingToggle
				name="coloredNicks"
				label="Colored nicknames"
				description="Assign a unique color to each nickname in chat"
				:checked="store.state.settings.coloredNicks"
			/>
			<SettingToggle
				name="autocomplete"
				label="Autocomplete"
				description="Suggest nicknames, channels, and commands as you type"
				:checked="store.state.settings.autocomplete"
			/>
			<div class="setting-row">
				<label for="nickPostfix" class="setting-row-text">
					<div class="setting-row-label">Nick autocomplete postfix</div>
					<div class="setting-row-description">
						Character added after a completed nickname (e.g. a comma)
					</div>
				</label>
			</div>
			<input
				id="nickPostfix"
				:value="store.state.settings.nickPostfix"
				type="text"
				name="nickPostfix"
				class="input"
				placeholder="e.g. , "
			/>
		</div>

		<!-- Custom stylesheet -->
		<div class="setting-card">
			<h2 class="setting-card-title">Custom stylesheet</h2>
			<div class="setting-row-description" style="margin-bottom: 4px">
				Override any style with your own CSS
			</div>
			<label for="user-specified-css-input" class="sr-only">
				Custom stylesheet
			</label>
			<textarea
				id="user-specified-css-input"
				:value="store.state.settings.userStyles"
				class="input"
				name="userStyles"
				placeholder="/* Add your custom CSS here */"
			/>
		</div>
	</div>
</template>

<style>
textarea#user-specified-css-input {
	height: 100px;
}
</style>

<script lang="ts">
import {defineComponent} from "vue";
import {useStore} from "../../js/store";
import SettingToggle from "./SettingToggle.vue";

export default defineComponent({
	name: "AppearanceSettings",
	components: {
		SettingToggle,
	},
	setup() {
		const store = useStore();

		return {
			store,
		};
	},
});
</script>
