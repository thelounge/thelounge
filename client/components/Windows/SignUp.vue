<template>
	<div id="sign-in" class="window" role="tabpanel" aria-label="Sign-up">
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

			<label for="signup-username">Username</label>
			<input
				id="signup-username"
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
				<label for="signup-password">Password</label>
				<RevealPassword v-slot:default="slotProps">
					<input
						id="signup-password"
						v-model="password"
						:type="slotProps.isVisible ? 'text' : 'password'"
						class="input"
						autocapitalize="none"
						autocorrect="off"
						autocomplete="new-password"
						required
					/>
				</RevealPassword>
			</div>

			<div class="password-container">
				<label for="signup-password-confirm">Confirm Password</label>
				<RevealPassword v-slot:default="slotProps">
					<input
						id="signup-password-confirm"
						v-model="passwordConfirm"
						:type="slotProps.isVisible ? 'text' : 'password'"
						class="input"
						autocapitalize="none"
						autocorrect="off"
						autocomplete="new-password"
						required
					/>
				</RevealPassword>
			</div>

			<div v-if="errorShown" class="error">{{ errorMessage }}</div>
			<div v-if="successShown" class="success">
				Registration successful! You can now
				<router-link to="/sign-in">sign in</router-link>.
			</div>

			<button :disabled="inFlight || successShown" type="submit" class="btn">Sign up</button>

			<p class="sign-in-link">
				Already have an account?
				<router-link to="/sign-in">Sign in</router-link>
			</p>
		</form>
	</div>
</template>

<script lang="ts">
import socket from "../../js/socket";
import RevealPassword from "../RevealPassword.vue";
import {defineComponent, onBeforeUnmount, onMounted, ref} from "vue";
import {useRouter} from "vue-router";

export default defineComponent({
	name: "SignUp",
	components: {
		RevealPassword,
	},
	setup() {
		const inFlight = ref(false);
		const errorShown = ref(false);
		const successShown = ref(false);
		const errorMessage = ref("");

		const username = ref("");
		const password = ref("");
		const passwordConfirm = ref("");

		const onRegisterSuccess = () => {
			inFlight.value = false;
			successShown.value = true;
			errorShown.value = false;
		};

		const onRegisterFailed = (data: {error: string}) => {
			inFlight.value = false;
			errorShown.value = true;
			errorMessage.value = data.error || "Registration failed.";
		};

		const onSubmit = (event: Event) => {
			event.preventDefault();

			if (!username.value || !password.value || !passwordConfirm.value) {
				return;
			}

			if (password.value !== passwordConfirm.value) {
				errorShown.value = true;
				errorMessage.value = "Passwords do not match.";
				return;
			}

			inFlight.value = true;
			errorShown.value = false;
			successShown.value = false;

			const values = {
				user: username.value,
				password: password.value,
				password_confirm: passwordConfirm.value,
			};

			socket.emit("auth:register", values);
		};

		onMounted(() => {
			socket.on("auth:register:success", onRegisterSuccess);
			socket.on("auth:register:failed", onRegisterFailed);
		});

		onBeforeUnmount(() => {
			socket.off("auth:register:success", onRegisterSuccess);
			socket.off("auth:register:failed", onRegisterFailed);
		});

		return {
			inFlight,
			errorShown,
			successShown,
			errorMessage,
			username,
			password,
			passwordConfirm,
			onSubmit,
		};
	},
});
</script>
