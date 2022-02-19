<template>
	<div>
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
		<div v-if="$store.state.serverConfiguration.fileUpload">
			<h2>File uploads</h2>
			<div>
				<label class="opt">
					<input
						:checked="$store.state.settings.uploadCanvas"
						type="checkbox"
						name="uploadCanvas"
					/>
					Attempt to remove metadata from images before uploading
					<span
						class="tooltipped tooltipped-n tooltipped-no-delay"
						aria-label="This option renders the image into a canvas element to remove metadata from the image.
	This may break orientation if your browser does not support that."
					>
						<button class="extra-help" />
					</span>
				</label>
			</div>
		</div>
		<div v-if="!$store.state.serverConfiguration.public">
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
		<div v-if="!$store.state.serverConfiguration.public">
			<h2>Automatic away message</h2>

			<label class="opt">
				<label for="awayMessage" class="sr-only">Automatic away message</label>
				<input
					id="awayMessage"
					:value="$store.state.settings.awayMessage"
					type="text"
					name="awayMessage"
					class="input"
					placeholder="Away message if The Lounge is not open"
				/>
			</label>
		</div>
	</div>
</template>

<style></style>

<script>
let installPromptEvent = null;

window.addEventListener("beforeinstallprompt", (e) => {
	e.preventDefault();
	installPromptEvent = e;
});

export default {
	name: "GeneralSettings",
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
	},
	mounted() {
		// Enable protocol handler registration if supported,
		// and the network configuration is not locked
		this.canRegisterProtocol =
			window.navigator.registerProtocolHandler &&
			!this.$store.state.serverConfiguration.lockNetwork;
	},
	methods: {
		nativeInstallPrompt() {
			installPromptEvent.prompt();
			installPromptEvent = null;
		},
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
	},
};
</script>
