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
				v-model="username"
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

			<div v-if="errorShown" class="error">Authentication failed.</div>

			<button :disabled="inFlight" type="submit" class="btn">Sign in</button>
		</form>
	</div>
</template>

<script lang="ts">
import storage from "../../js/localStorage";
import socket from "../../js/socket";
import RevealPassword from "../RevealPassword.vue";
import {defineComponent, onBeforeUnmount, onMounted, ref} from "vue";

export default defineComponent({
	name: "SignIn",
	components: {
		RevealPassword,
	},
	setup() {
		const inFlight = ref(false);
		const errorShown = ref(false);

		const username = ref(storage.get("user") || "");
		const password = ref("");

		const onAuthFailed = () => {
			inFlight.value = false;
			errorShown.value = true;
		};

		const onSubmit = (event: Event) => {
			event.preventDefault();

			if (!username.value || !password.value) {
				return;
			}

			inFlight.value = true;
			errorShown.value = false;

			const values = {
				user: username.value,
				password: password.value,
			};

			storage.set("user", values.user);

			socket.emit("auth:perform", values);
		};

		onMounted(() => {
			socket.on("auth:failed", onAuthFailed);
		});

		onBeforeUnmount(() => {
			socket.off("auth:failed", onAuthFailed);
		});

		return {
			inFlight,
			errorShown,
			username,
			password,
			onSubmit,
		};
	},
});
</script>
