<template>
	<div>
		<!-- Native app -->
		<div v-if="canRegisterProtocol || hasInstallPromptEvent" class="setting-card">
			<h2 class="setting-card-title">Native app</h2>
			<div v-if="hasInstallPromptEvent" class="setting-action-row">
				<div class="setting-row-description" style="margin-bottom: 8px">
					Install The Lounge as a standalone app on your device
				</div>
				<button type="button" class="btn" @click.prevent="nativeInstallPrompt">
					Add to Home screen
				</button>
			</div>
			<div v-if="canRegisterProtocol" class="setting-action-row">
				<div class="setting-row-description" style="margin-bottom: 8px">
					Handle irc:// links directly in The Lounge
				</div>
				<button type="button" class="btn" @click.prevent="registerProtocol">
					Register as irc:// handler
				</button>
			</div>
		</div>

		<!-- File uploads -->
		<div v-if="store.state.serverConfiguration?.fileUpload" class="setting-card">
			<h2 class="setting-card-title">File uploads</h2>
			<SettingToggle
				name="uploadCanvas"
				label="Strip image metadata"
				description="Re-render images to remove EXIF data before uploading. May affect orientation in older browsers."
				:checked="store.state.settings.uploadCanvas"
			/>
		</div>

		<!-- Settings sync -->
		<div v-if="!store.state.serverConfiguration?.public" class="setting-card">
			<h2 class="setting-card-title">Settings sync</h2>
			<SettingToggle
				name="syncSettings"
				label="Sync settings across devices"
				description="Keep your preferences in sync with other browsers and devices"
				:checked="store.state.settings.syncSettings"
			/>
			<template v-if="!store.state.settings.syncSettings">
				<div v-if="store.state.serverHasSettings" class="setting-info-panel warning">
					<p>
						<strong>Warning:</strong> Enabling sync will override this client's
						settings with those stored on the server.
					</p>
					<button type="button" class="btn btn-small" @click="onForceSyncClick">
						Sync settings and enable
					</button>
				</div>
				<div v-else class="setting-info-panel warning">
					<p>
						No settings have been synced before. Enabling this will upload your
						current settings as the starting point for other devices.
					</p>
				</div>
			</template>
		</div>

		<!-- Away message -->
		<div v-if="!store.state.serverConfiguration?.public" class="setting-card">
			<h2 class="setting-card-title">Away message</h2>
			<label for="awayMessage" class="setting-row-text">
				<div class="setting-row-description">
					Automatically set this away message when The Lounge is not open
				</div>
			</label>
			<input
				id="awayMessage"
				:value="store.state.settings.awayMessage"
				type="text"
				name="awayMessage"
				class="input"
				placeholder="Away message"
			/>
		</div>
	</div>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, ref} from "vue";
import {useStore} from "../../js/store";
import {BeforeInstallPromptEvent} from "../../js/types";
import SettingToggle from "./SettingToggle.vue";

let installPromptEvent: BeforeInstallPromptEvent | null = null;

window.addEventListener("beforeinstallprompt", (e) => {
	e.preventDefault();
	installPromptEvent = e as BeforeInstallPromptEvent;
});

export default defineComponent({
	name: "GeneralSettings",
	components: {
		SettingToggle,
	},
	setup() {
		const store = useStore();
		const canRegisterProtocol = ref(false);

		const hasInstallPromptEvent = computed(() => {
			// TODO: This doesn't hide the button after clicking
			return installPromptEvent !== null;
		});

		onMounted(() => {
			// Enable protocol handler registration if supported,
			// and the network configuration is not locked
			canRegisterProtocol.value =
				!!window.navigator.registerProtocolHandler &&
				!store.state.serverConfiguration?.lockNetwork;
		});

		const nativeInstallPrompt = () => {
			if (!installPromptEvent) {
				return;
			}

			installPromptEvent.prompt().catch((e) => {
				// eslint-disable-next-line no-console
				console.error(e);
			});

			installPromptEvent = null;
		};

		const onForceSyncClick = () => {
			store.dispatch("settings/syncAll", true).catch((e) => {
				// eslint-disable-next-line no-console
				console.error(e);
			});

			store
				.dispatch("settings/update", {
					name: "syncSettings",
					value: true,
					sync: true,
				})
				.catch((e) => {
					// eslint-disable-next-line no-console
					console.error(e);
				});
		};

		const registerProtocol = () => {
			const uri = document.location.origin + document.location.pathname + "?uri=%s";
			// @ts-expect-error
			// the third argument is deprecated but recommended for compatibility: https://developer.mozilla.org/en-US/docs/Web/API/Navigator/registerProtocolHandler
			window.navigator.registerProtocolHandler("irc", uri, "The Lounge");
			// @ts-expect-error
			window.navigator.registerProtocolHandler("ircs", uri, "The Lounge");
		};

		return {
			store,
			canRegisterProtocol,
			hasInstallPromptEvent,
			nativeInstallPrompt,
			onForceSyncClick,
			registerProtocol,
		};
	},
});
</script>
