<template>
	<div id="sign-in" class="window" role="tabpanel" aria-label="Sign-in">
		<div class="container">
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
			<template
				v-if="store.state.authMethod === 'local' || store.state.authMethod === 'ldap'"
			>
				<form class="container" method="post" action="" @submit="onSubmit">
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

					<div v-if="errorShown" class="error">{{ errorMessage }}</div>

					<button :disabled="inFlight" type="submit" class="btn">Sign in</button>
				</form>
			</template>

			<template v-if="store.state.authMethod === 'oidc'">
				<a href="/login"><button class="btn">SSO Sign In</button></a>
			</template>
		</div>
	</div>
</template>

<script lang="ts">
import storage from "../../js/localStorage";
import socket from "../../js/socket";
import RevealPassword from "../RevealPassword.vue";
import {computed, defineComponent, onBeforeUnmount, onMounted, ref, watch} from "vue";
import {useStore} from "../../js/store";

export default defineComponent({
	name: "SignIn",
	components: {
		RevealPassword,
	},
	setup() {
		const store = useStore();
		const authMethod = computed(() => store.state.authMethod);

		const inFlight = ref(false);
		const errorShown = ref(false);
		const errorMessage = ref("");

		const username = ref(storage.get("user") || "");
		const password = ref("");

		const onAuthFailed = () => {
			inFlight.value = false;
			errorShown.value = true;
		};

		const onSubmit = (event: Event) => {
			event.preventDefault();

			// In public mode (authMethod === "none"), we don't need username/password
			if (authMethod.value !== "none" && (!username.value || !password.value)) {
				return;
			}

			inFlight.value = true;
			errorShown.value = false;

			const values = {
				user: username.value,
				password: password.value,
			};

			storage.set("user", values.user);

			inFlight.value = true;

			const form = new URLSearchParams();

			if (authMethod.value !== "none") {
				form.append("username", values.user);
				form.append("password", values.password);
			}

			fetch("/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: form.toString(),
			})
				.then((response) => {
					if (response.status >= 400) {
						response
							.text()
							.then((body) => {
								errorMessage.value = `Authentication failed: ${body}`;
							})
							.catch((error) => {
								errorMessage.value = `No body: ${error}`;
							})
							.finally(() => {
								errorShown.value = true;
							});

						return;
					}

					errorShown.value = false;
					errorMessage.value = "";

					// Reload the page to reconnect socket with authenticated session
					window.location.href = "/";
				})
				.catch((err) => {
					errorMessage.value = `Authentication failed: ${err}`;
					errorShown.value = true;
				})
				.finally(() => {
					inFlight.value = false;
				});
		};

		const handleAuthMethod = () => {
			if (authMethod.value === "oidc") {
				window.location.href = "/login";
			} else if (authMethod.value === "none") {
				onSubmit(new Event("click"));
			}
		};

		// Watch for authMethod changes (it may be undefined initially and set later by App.vue)
		watch(
			authMethod,
			(newValue) => {
				if (newValue !== undefined) {
					handleAuthMethod();
				}
			},
			{immediate: true}
		);

		onMounted(() => {
			socket.on("auth:failed", onAuthFailed);
		});

		onBeforeUnmount(() => {
			socket.off("auth:failed", onAuthFailed);
		});

		return {
			store,
			inFlight,
			errorShown,
			errorMessage,
			username,
			password,
			onSubmit,
		};
	},
});
</script>
