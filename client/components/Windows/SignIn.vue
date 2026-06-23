<template>
	<div id="sign-in" class="window" role="tabpanel" aria-label="Sign-in">
		<form class="container" method="post" action="" @submit="onSubmit">
			<img
				src="img/logo-vertical-transparent-bg.svg"
				class="logo"
				alt="The Lounge"
				width="256"
				height="170"
			/>
			<img
				src="img/logo-vertical-transparent-bg-inverted.svg"
				class="logo-inverted"
				alt="The Lounge"
				width="256"
				height="170"
			/>

			<label for="signin-username">Username</label>
			<input
				id="signin-username"
				v-model.trim="username"
				class="input"
				type="text"
				name="username"
				autocapitalize="none"
				autocorrect="off"
				autocomplete="username"
				required
				autofocus
			/>

			<div class="password-container">
				<label for="signin-password">Password</label>
				<RevealPassword v-slot:default="slotProps">
					<input
						id="signin-password"
						v-model="password"
						:type="slotProps.isVisible ? 'text' : 'password'"
						class="input"
						autocapitalize="none"
						autocorrect="off"
						autocomplete="current-password"
						required
					/>
				</RevealPassword>
			</div>

			<div v-if="errorMessage" class="error">
				{{ errorMessage === true ? "Authentication failed." : errorMessage }}
			</div>

			<button :disabled="!canSubmit" type="submit" class="btn">Sign in</button>
		</form>
	</div>
</template>

<script lang="ts">
import storage from "../../js/localStorage";
import socket, {tryAgainMessage} from "../../js/socket";
import {store} from "../../js/store";
import RevealPassword from "../RevealPassword.vue";
import {defineComponent, onBeforeUnmount, onMounted, ref} from "vue";

export default defineComponent({
	name: "SignIn",
	components: {
		RevealPassword,
	},
	setup() {
		// If authFailure reads "disconnected" initially, the user was likely blocked.
		// ("Authentication failed." should never show on initial page load.)
		const canSubmit = ref(store.state.authFailure !== "disconnected");
		const errorMessage = ref<string | boolean>(
			store.state.authFailure === "disconnected" ? tryAgainMessage : false
		);

		const username = ref(storage.get("user") || "");
		const password = ref("");

		const onAuthFailed = () => {
			canSubmit.value = true;
			errorMessage.value = true;
		};

		const onSubmit = (event: Event) => {
			event.preventDefault();

			if (!username.value || !password.value) {
				return;
			}

			canSubmit.value = false;
			errorMessage.value = false;

			const values = {
				user: username.value,
				password: password.value,
			};

			storage.set("user", values.user);

			socket.emit("auth:perform", values);
		};

		const unwatchAuthFailure = store.watch(
			(state) => state.authFailure,
			(authFailure, oldAuthFailure) => {
				if (authFailure === "disconnected") {
					// Occurs when long-poll or socket reconnect receives 403 after auth failure
					// (i.e. block activated)
					errorMessage.value = tryAgainMessage;
					canSubmit.value = false;
				} else if (authFailure === null && oldAuthFailure === "disconnected") {
					// Occurs when socket connection is successfully established after page reload,
					// after previously losing connection after auth failure (i.e. block removed)
					errorMessage.value = false;
					canSubmit.value = true;
				}
			}
		);

		onMounted(() => {
			socket.on("auth:failed", onAuthFailed);
		});

		onBeforeUnmount(() => {
			socket.off("auth:failed", onAuthFailed);
			unwatchAuthFailure();
		});

		return {
			canSubmit,
			errorMessage,
			username,
			password,
			onSubmit,
		};
	},
});
</script>
