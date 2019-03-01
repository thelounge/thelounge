<template>
	<div
		id="settings"
		class="window"
		role="tabpanel"
		aria-label="Settings">
		<div class="header">
			<button
				class="lt"
				aria-label="Toggle channel list" />
		</div>
		<div class="container">
			<h1 class="title">Settings</h1>

			<div class="row">
				<div class="col-sm-6">
					<label class="opt">
						<input
							type="checkbox"
							name="advanced">
						Advanced settings
					</label>
				</div>
			</div>

			<div class="row">
				<div
					id="native-app"
					class="col-sm-12"
					hidden>
					<h2>Native app</h2>
					<button
						id="webapp-install-button"
						type="button"
						class="btn"
						hidden>Add The Lounge to Home screen</button>
					<button
						id="make-default-client"
						type="button"
						class="btn">Open irc:// URLs with The Lounge</button>
				</div>

				<div
					v-if="!this.$root.serverConfiguration.public"
					class="col-sm-12"
					data-advanced>
					<h2>
						Settings synchronisation
						<span
							class="tooltipped tooltipped-n tooltipped-no-delay"
							aria-label="Note: This is an experimental feature and may change in future releases.">
							<button
								class="extra-experimental"
								aria-label="Note: This is an experimental feature and may change in future releases." />
						</span>
					</h2>
					<label class="opt">
						<input
							type="checkbox"
							name="syncSettings">
						Synchronize settings with other clients.
					</label>
					<p class="sync-warning-override"><strong>Warning</strong> Checking this box will override the settings of this client with those stored on the server.</p>
					<p class="sync-warning-base"><strong>Warning</strong> No settings have been synced before. Enabling this will sync all settings of this client as the base for other clients.</p>
					<div class="opt force-sync-button">
						<button
							type="button"
							class="btn"
							@click="onForceSyncClick">Force sync settings</button>
						<p>This will override any settings already synced to the server.</p>
					</div>
				</div>

				<div class="col-sm-12">
					<h2>Messages</h2>
				</div>
				<div class="col-sm-6">
					<label class="opt">
						<input
							type="checkbox"
							name="motd">
						Show <abbr title="Message Of The Day">MOTD</abbr>
					</label>
				</div>
				<div class="col-sm-6">
					<label class="opt">
						<input
							type="checkbox"
							name="showSeconds">
						Show seconds in timestamp
					</label>
				</div>
				<div class="col-sm-12">
					<h2>
						Status messages
						<span
							class="tooltipped tooltipped-n tooltipped-no-delay"
							aria-label="Joins, parts, kicks, nick changes, away changes, and mode changes">
							<button
								class="extra-help"
								aria-label="Joins, parts, kicks, nick changes, away changes, and mode changes" />
						</span>
					</h2>
				</div>
				<div class="col-sm-12">
					<label class="opt">
						<input
							type="radio"
							name="statusMessages"
							value="shown">
						Show all status messages individually
					</label>
					<label class="opt">
						<input
							type="radio"
							name="statusMessages"
							value="condensed">
						Condense status messages together
					</label>
					<label class="opt">
						<input
							type="radio"
							name="statusMessages"
							value="hidden">
						Hide all status messages
					</label>
				</div>
				<div class="col-sm-12">
					<h2>Visual Aids</h2>
				</div>
				<div class="col-sm-12">
					<label class="opt">
						<input
							type="checkbox"
							name="coloredNicks">
						Enable colored nicknames
					</label>
					<label class="opt">
						<input
							type="checkbox"
							name="autocomplete">
						Enable autocomplete
					</label>
				</div>
				<div
					class="col-sm-12"
					data-advanced>
					<label class="opt">
						<label
							for="nickPostfix"
							class="sr-only">Nick autocomplete postfix (e.g. <code>, </code>)</label>
						<input
							id="nickPostfix"
							type="text"
							name="nickPostfix"
							class="input"
							placeholder="Nick autocomplete postfix (e.g. ', ')">
					</label>
				</div>

				<div class="col-sm-12">
					<h2>Theme</h2>
				</div>
				<div class="col-sm-12">
					<label
						for="theme-select"
						class="sr-only">Theme</label>
					<select
						id="theme-select"
						name="theme"
						class="input">
						<option
							v-for="theme in this.$root.serverConfiguration.themes"
							:key="theme.name">
							{{ theme.displayName }}
						</option>
					</select>
				</div>

				<template v-if="this.$root.serverConfiguration.prefetch">
					<div class="col-sm-12">
						<h2>Link previews</h2>
					</div>
					<div class="col-sm-6">
						<label class="opt">
							<input
								type="checkbox"
								name="media">
							Auto-expand media
						</label>
					</div>
					<div class="col-sm-6">
						<label class="opt">
							<input
								type="checkbox"
								name="links">
							Auto-expand websites
						</label>
					</div>
				</template>

				<template v-if="!this.$root.serverConfiguration.public">
					<div class="col-sm-12">
						<h2>Push Notifications</h2>
					</div>
					<div class="col-sm-12">
						<button
							id="pushNotifications"
							type="button"
							class="btn"
							disabled
							data-text-alternate="Unsubscribe from push notifications">Subscribe to push notifications</button>
						<div
							v-if="this.$root.pushNotificationState === 'nohttps'"
							class="error">
							<strong>Warning</strong>:
							Push notifications are only supported over HTTPS connections.
						</div>
						<div
							v-if="this.$root.pushNotificationState === 'unsupported'"
							class="error">
							<strong>Warning</strong>:
							<span>Push notifications are not supported by your browser.</span>
						</div>
					</div>
				</template>

				<div class="col-sm-12">
					<h2>Browser Notifications</h2>
				</div>
				<div class="col-sm-12">
					<label class="opt">
						<input
							id="desktopNotifications"
							type="checkbox"
							name="desktopNotifications">
						Enable browser notifications<br>
						<div
							v-if="this.$root.desktopNotificationState === 'unsupported'"
							class="error">
							<strong>Warning</strong>:
							Notifications are not supported by your browser.
						</div>
						<div
							v-if="this.$root.desktopNotificationState === 'blocked'"
							id="warnBlockedDesktopNotifications"
							class="error">
							<strong>Warning</strong>:
							Notifications are blocked by your browser.
						</div>
					</label>
				</div>
				<div class="col-sm-12">
					<label class="opt">
						<input
							type="checkbox"
							name="notification">
						Enable notification sound
					</label>
				</div>
				<div class="col-sm-12">
					<div class="opt">
						<button id="play">Play sound</button>
					</div>
				</div>

				<div
					class="col-sm-12"
					data-advanced>
					<label class="opt">
						<input
							type="checkbox"
							name="notifyAllMessages">
						Enable notification for all messages
					</label>
				</div>

				<div
					class="col-sm-12"
					data-advanced>
					<label class="opt">
						<label
							for="highlights"
							class="sr-only">Custom highlights (comma-separated keywords)</label>
						<input
							id="highlights"
							type="text"
							name="highlights"
							class="input"
							placeholder="Custom highlights (comma-separated keywords)">
					</label>
				</div>

				<div
					v-if="!this.$root.serverConfiguration.public && !this.$root.serverConfiguration.ldapEnabled"
					id="change-password">
					<form
						action=""
						method="post"
						data-event="change-password">
						<div class="col-sm-12">
							<h2>Change password</h2>
						</div>
						<div class="col-sm-12 password-container">
							<!-- TODO: use revealPassword -->
							<label
								for="old_password_input"
								class="sr-only">Enter current password</label>
							<input
								id="old_password_input"
								type="password"
								name="old_password"
								class="input"
								placeholder="Enter current password">
						</div>
						<div class="col-sm-12 password-container">
							<label
								for="new_password_input"
								class="sr-only">Enter desired new password</label>
							<input
								id="new_password_input"
								type="password"
								name="new_password"
								class="input"
								placeholder="Enter desired new password">
						</div>
						<div class="col-sm-12 password-container">
							<label
								for="verify_password_input"
								class="sr-only">Repeat new password</label>
							<input
								id="verify_password_input"
								type="password"
								name="verify_password"
								class="input"
								placeholder="Repeat new password">
						</div>
						<div class="col-sm-12 feedback" />
						<div class="col-sm-12">
							<button
								type="submit"
								class="btn">Change password</button>
						</div>
					</form>
				</div>

				<div
					class="col-sm-12"
					data-advanced>
					<h2>Custom Stylesheet</h2>
				</div>
				<div
					class="col-sm-12"
					data-advanced>
					<label
						for="user-specified-css-input"
						class="sr-only">Custom stylesheet. You can override any style with CSS here.</label>
					<textarea
						id="user-specified-css-input"
						v-model="$root.settings.userStyles"
						class="input"
						name="userStyles"
						placeholder="/* You can override any style with CSS here */" />
				</div>
			</div>

			<div
				v-if="!this.$root.serverConfiguration.public"
				class="session-list">
				<h2>Sessions</h2>

				<h3>Current session</h3>
				<div id="session-current" />

				<h3>Other sessions</h3>
				<div id="session-list" />
			</div>
		</div>

	</div>
</template>

<script>
const storage = require("../../js/localStorage");
import socket from "../../js/socket";
import RevealPassword from "../RevealPassword.vue";

export default {
	name: "Settings",
	components: {
		RevealPassword,
	},
	data() {
		return {
			inFlight: false,
			errorShown: false,
		};
	},
	methods: {
		onSubmit(event) {
			event.preventDefault();

			this.inFlight = true;
			this.errorShown = false;

			const values = {
				user: this.$refs.username.value,
				password: this.$refs.password.value,
			};

			storage.set("user", values.user);

			socket.emit("auth", values);
		},
		onForceSyncClick() {
			const options = require("../../js/options");
			options.syncAllSettings(true);
		},
	},
};
</script>
