<template>
	<div>
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
				<label for="current-password" class="sr-only"> Enter current password </label>
				<RevealPassword v-slot:default="slotProps">
					<input
						id="current-password"
						autocomplete="current-password"
						:type="slotProps.isVisible ? 'text' : 'password'"
						name="old_password"
						class="input"
						placeholder="Enter current password"
					/>
				</RevealPassword>
			</div>
			<div class="password-container">
				<label for="new-password" class="sr-only"> Enter desired new password </label>
				<RevealPassword v-slot:default="slotProps">
					<input
						id="new-password"
						:type="slotProps.isVisible ? 'text' : 'password'"
						name="new_password"
						autocomplete="new-password"
						class="input"
						placeholder="Enter desired new password"
					/>
				</RevealPassword>
			</div>
			<div class="password-container">
				<label for="new-password-verify" class="sr-only"> Repeat new password </label>
				<RevealPassword v-slot:default="slotProps">
					<input
						id="new-password-verify"
						:type="slotProps.isVisible ? 'text' : 'password'"
						name="verify_password"
						autocomplete="new-password"
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

<script>
import socket from "../../js/socket";
import RevealPassword from "../RevealPassword.vue";
import Session from "../Session.vue";

export default {
	name: "UserSettings",
	components: {
		RevealPassword,
		Session,
	},
	data() {
		return {
			passwordChangeStatus: null,
			passwordErrors: {
				missing_fields: "Please enter a new password",
				password_mismatch: "Both new password fields must match",
				password_incorrect:
					"The current password field does not match your account password",
				update_failed: "Failed to update your password",
			},
		};
	},
	computed: {
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
	},
	methods: {
		changePassword() {
			const allFields = new FormData(this.$refs.settingsForm);
			const data = {
				old_password: allFields.get("old_password"),
				new_password: allFields.get("new_password"),
				verify_password: allFields.get("verify_password"),
			};

			if (!data.old_password || !data.new_password || !data.verify_password) {
				this.passwordChangeStatus = {
					success: false,
					error: "missing_fields",
				};
				return;
			}

			if (data.new_password !== data.verify_password) {
				this.passwordChangeStatus = {
					success: false,
					error: "password_mismatch",
				};
				return;
			}

			socket.once("change-password", (response) => {
				this.passwordChangeStatus = response;
			});

			socket.emit("change-password", data);
		},
	},
};
</script>
