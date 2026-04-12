<template>
	<div>
		<!-- Push notifications -->
		<SettingCard v-if="!store.state.serverConfiguration?.public" title="Push notifications">
			<div class="setting-action-row">
				<div class="setting-card-intro">
					Receive notifications even when The Lounge is not open
				</div>
				<button
					id="pushNotifications"
					type="button"
					class="btn btn-small"
					:disabled="
						store.state.pushNotificationState !== 'supported' &&
						store.state.pushNotificationState !== 'subscribed'
					"
					@click="onPushButtonClick"
				>
					<template v-if="store.state.pushNotificationState === 'subscribed'">
						Unsubscribe from push notifications
					</template>
					<template v-else-if="store.state.pushNotificationState === 'loading'">
						Loading…
					</template>
					<template v-else> Subscribe to push notifications </template>
				</button>
				<div
					v-if="store.state.pushNotificationState === 'nohttps'"
					class="setting-info-panel error"
				>
					<strong>Warning:</strong> Push notifications are only supported over HTTPS
					connections.
				</div>
				<div
					v-if="store.state.pushNotificationState === 'unsupported'"
					class="setting-info-panel error"
				>
					<strong>Warning:</strong> Push notifications are not supported by your browser.
				</div>
			</div>
		</SettingCard>

		<!-- Browser notifications & sound -->
		<SettingCard title="Notifications">
			<SettingToggle
				name="desktopNotifications"
				label="Browser notifications"
				description="Show desktop notifications for mentions and private messages"
				:checked="store.state.settings.desktopNotifications"
				:disabled="store.state.desktopNotificationState === 'nohttps'"
			/>
			<div
				v-if="store.state.desktopNotificationState === 'unsupported'"
				class="setting-info-panel error"
			>
				<strong>Warning:</strong> Notifications are not supported by your browser.
			</div>
			<div
				v-if="store.state.desktopNotificationState === 'nohttps'"
				class="setting-info-panel error"
			>
				<strong>Warning:</strong> Notifications are only supported over HTTPS connections.
			</div>
			<div
				v-if="store.state.desktopNotificationState === 'blocked'"
				class="setting-info-panel error"
			>
				<strong>Warning:</strong> Notifications are blocked by your browser.
			</div>
			<SettingToggle
				name="notification"
				label="Notification sound"
				description="Play a sound when a notification is triggered"
				:checked="store.state.settings.notification"
			/>
			<div class="setting-action-row">
				<button
					id="play"
					type="button"
					class="btn btn-small"
					@click.prevent="playNotification"
				>
					Play sound
				</button>
			</div>
			<SettingToggle
				name="notifyAllMessages"
				label="Notify on all messages"
				description="Send a notification for every message, not just mentions"
				:checked="store.state.settings.notifyAllMessages"
			/>
		</SettingCard>

		<!-- Highlights -->
		<SettingCard v-if="!store.state.serverConfiguration?.public" title="Highlights">
			<label for="highlights" class="setting-row-text">
				<div class="setting-row-label">Custom highlights</div>
				<div class="setting-row-description">
					Comma-separated words or phrases that trigger a highlight
				</div>
			</label>
			<input
				id="highlights"
				:value="store.state.settings.highlights"
				type="text"
				name="highlights"
				class="input"
				autocomplete="off"
				placeholder="e.g. word, some phrase, another"
			/>
			<label for="highlightExceptions" class="setting-row-text">
				<div class="setting-row-label">Highlight exceptions</div>
				<div class="setting-row-description">
					Comma-separated words that will never trigger a highlight
				</div>
			</label>
			<input
				id="highlightExceptions"
				:value="store.state.settings.highlightExceptions"
				type="text"
				name="highlightExceptions"
				class="input"
				autocomplete="off"
				placeholder="e.g. bot, service"
			/>
		</SettingCard>
	</div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {useStore} from "../../js/store";
import webpush from "../../js/webpush";
import SettingCard from "./SettingCard.vue";
import SettingToggle from "./SettingToggle.vue";

export default defineComponent({
	name: "NotificationSettings",
	components: {
		SettingCard,
		SettingToggle,
	},
	setup() {
		const store = useStore();

		const playNotification = () => {
			const pop = new Audio();
			pop.src = "audio/pop.wav";

			// eslint-disable-next-line
			pop.play();
		};

		const onPushButtonClick = () => {
			webpush.togglePushSubscription();
		};

		return {
			store,
			playNotification,
			onPushButtonClick,
		};
	},
});
</script>
