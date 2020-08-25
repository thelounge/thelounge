<template>
	<div class="settings">
		<div v-if="canRegisterProtocol || hasInstallPromptEvent">
			<h2>Native app</h2>
			<button
				v-if="hasInstallPromptEvent"
				type="button"
				class="btn"
				@click.prevent="nativeInstallPrompt"
			>
				Add The Lounge to Home screen
			</button>
			<button
				v-if="canRegisterProtocol"
				type="button"
				class="btn"
				@click.prevent="registerProtocol"
			>
				Open irc:// URLs with The Lounge
			</button>
		</div>

		<div v-if="!$store.state.serverConfiguration.public && $store.state.settings.advanced">
			<h2>Settings synchronisation</h2>
			<label class="opt">
				<input
					:checked="$store.state.settings.syncSettings"
					type="checkbox"
					name="syncSettings"
				/>
				Synchronize settings with other clients
			</label>
			<template v-if="!$store.state.settings.syncSettings">
				<div v-if="$store.state.serverHasSettings" class="settings-sync-panel">
					<p>
						<strong>Warning:</strong> Checking this box will override the settings of
						this client with those stored on the server.
					</p>
					<p>
						Use the button below to enable synchronization, and override any settings
						already synced to the server.
					</p>
					<button type="button" class="btn btn-small" @click="onForceSyncClick">
						Sync settings and enable
					</button>
				</div>
				<div v-else class="settings-sync-panel">
					<p>
						<strong>Warning:</strong> No settings have been synced before. Enabling this
						will sync all settings of this client as the base for other clients.
					</p>
				</div>
			</template>
		</div>

		<div
			v-if="
				!$store.state.serverConfiguration.public &&
				!$store.state.serverConfiguration.ldapEnabled
			"
			id="change-password"
			role="group"
			aria-labelledby="label-change-password"
		>
			<h2 id="label-change-password">Change password</h2>
			<div class="password-container">
				<label for="old_password_input" class="sr-only">
					Enter current password
				</label>
				<RevealPassword v-slot:default="slotProps">
					<input
						id="old_password_input"
						:type="slotProps.isVisible ? 'text' : 'password'"
						name="old_password"
						class="input"
						placeholder="Enter current password"
					/>
				</RevealPassword>
			</div>
			<div class="password-container">
				<label for="new_password_input" class="sr-only">
					Enter desired new password
				</label>
				<RevealPassword v-slot:default="slotProps">
					<input
						id="new_password_input"
						:type="slotProps.isVisible ? 'text' : 'password'"
						name="new_password"
						class="input"
						placeholder="Enter desired new password"
					/>
				</RevealPassword>
			</div>
			<div class="password-container">
				<label for="verify_password_input" class="sr-only">
					Repeat new password
				</label>
				<RevealPassword v-slot:default="slotProps">
					<input
						id="verify_password_input"
						:type="slotProps.isVisible ? 'text' : 'password'"
						name="verify_password"
						class="input"
						placeholder="Repeat new password"
					/>
				</RevealPassword>
			</div>
			<div
				v-if="passwordChangeStatus && passwordChangeStatus.success"
				class="feedback success"
			>
				Successfully updated your password
			</div>
			<div
				v-else-if="passwordChangeStatus && passwordChangeStatus.error"
				class="feedback error"
			>
				{{ passwordErrors[passwordChangeStatus.error] }}
			</div>
			<div>
				<button type="submit" class="btn" @click.prevent="changePassword">
					Change password
				</button>
			</div>
		</div>

		<div v-if="$store.state.settings.advanced">
			<h2>Custom Stylesheet</h2>
			<label for="user-specified-css-input" class="sr-only">
				Custom stylesheet. You can override any style with CSS here.
			</label>
			<textarea
				id="user-specified-css-input"
				:value="$store.state.settings.userStyles"
				class="input"
				name="userStyles"
				placeholder="/* You can override any style with CSS here */"
			/>
		</div>

		<div v-if="!$store.state.serverConfiguration.public" class="session-list" role="group">
			<h2>Sessions</h2>

			<h3>Current session</h3>
			<Session v-if="currentSession" :session="currentSession" />

			<template v-if="activeSessions.length > 0">
				<h3>Active sessions</h3>
				<Session
					v-for="session in activeSessions"
					:key="session.token"
					:session="session"
				/>
			</template>

			<h3>Other sessions</h3>
			<p v-if="$store.state.sessions.length === 0">Loading…</p>
			<p v-else-if="otherSessions.length === 0">
				<em>You are not currently logged in to any other device.</em>
			</p>
			<Session
				v-for="session in otherSessions"
				v-else
				:key="session.token"
				:session="session"
			/>
		</div>
	</div>
</template>

<style>
textarea#user-specified-css-input {
	height: 100px;
}
</style>

<script>
import socket from "../../../js/socket";
import webpush from "../../../js/webpush";
import Session from "../../Session.vue";

let installPromptEvent = null;

window.addEventListener("beforeinstallprompt", (e) => {
	e.preventDefault();
	installPromptEvent = e;
});

export default {
	name: "MainSettings",
	components: {
		Session,
	},
	data() {
		return {
			canRegisterProtocol: false,
		};
	},
	computed: {
		hasInstallPromptEvent() {
			// TODO: This doesn't hide the button after clicking
			return installPromptEvent !== null;
		},
		currentSession() {
			return this.$store.state.sessions.find((item) => item.current);
		},
		activeSessions() {
			return this.$store.state.sessions.filter((item) => !item.current && item.active > 0);
		},
		otherSessions() {
			return this.$store.state.sessions.filter((item) => !item.current && !item.active);
		},
	},
	mounted() {
		socket.emit("sessions:get");

		// Enable protocol handler registration if supported,
		// and the network configuration is not locked
		this.canRegisterProtocol =
			window.navigator.registerProtocolHandler &&
			!this.$store.state.serverConfiguration.lockNetwork;
	},
	methods: {
		onForceSyncClick() {
			this.$store.dispatch("settings/syncAll", true);
			this.$store.dispatch("settings/update", {
				name: "syncSettings",
				value: true,
				sync: true,
			});
		},
		registerProtocol() {
			const uri = document.location.origin + document.location.pathname + "?uri=%s";

			window.navigator.registerProtocolHandler("irc", uri, "The Lounge");
			window.navigator.registerProtocolHandler("ircs", uri, "The Lounge");
		},
		nativeInstallPrompt() {
			installPromptEvent.prompt();
			installPromptEvent = null;
		},
	},
};
</script>
