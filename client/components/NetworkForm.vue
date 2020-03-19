<template>
	<div id="connect" class="window" role="tabpanel" aria-label="Connect">
		<div class="header">
			<SidebarToggle />
		</div>
		<form class="container" method="post" action="" @submit.prevent="onSubmit">
			<h1 class="title">
				<template v-if="defaults.uuid">
					<input type="hidden" name="uuid" :value="defaults.uuid" />
					Edit {{ defaults.name }}
				</template>
				<template v-else>
					Connect
					<template v-if="!config.displayNetwork && config.lockNetwork">
						to {{ defaults.name }}
					</template>
				</template>
			</h1>
			<template v-if="config.displayNetwork">
				<h2>Network settings</h2>
				<div class="connect-row">
					<label for="connect:name">Name</label>
					<input
						id="connect:name"
						class="input"
						name="name"
						:value="defaults.name"
						maxlength="100"
					/>
				</div>
				<div class="connect-row">
					<label for="connect:host">Server</label>
					<div class="input-wrap">
						<input
							id="connect:host"
							class="input"
							name="host"
							:value="defaults.host"
							aria-label="Server address"
							maxlength="255"
							required
							:disabled="config.lockNetwork ? true : false"
						/>
						<span id="connect:portseparator">:</span>
						<input
							id="connect:port"
							ref="serverPort"
							class="input"
							type="number"
							min="1"
							max="65535"
							name="port"
							:value="defaults.port"
							aria-label="Server port"
							:disabled="config.lockNetwork ? true : false"
						/>
					</div>
				</div>
				<div class="connect-row">
					<label></label>
					<div class="input-wrap">
						<label class="tls">
							<input
								type="checkbox"
								name="tls"
								:checked="defaults.tls ? true : false"
								:disabled="
									config.lockNetwork || defaults.hasSTSPolicy ? true : false
								"
								@change="onSecureChanged"
							/>
							Use secure connection (TLS)
							<span
								v-if="defaults.hasSTSPolicy"
								class="tooltipped tooltipped-n tooltipped-no-delay"
								aria-label="This network has a strict transport security policy, you will be unable to disable TLS"
								>🔒 STS</span
							>
						</label>
						<label class="tls">
							<input
								type="checkbox"
								name="rejectUnauthorized"
								:checked="defaults.rejectUnauthorized ? true : false"
								:disabled="config.lockNetwork ? true : false"
							/>
							Only allow trusted certificates
						</label>
					</div>
				</div>
			</template>

			<h2>User preferences</h2>
			<div class="connect-row">
				<label for="connect:nick">Nick</label>
				<input
					id="connect:nick"
					class="input nick"
					name="nick"
					pattern="[^\s:!@]+"
					:value="defaults.nick"
					maxlength="100"
					required
					@input="onNickChanged"
				/>
			</div>
			<template v-if="!config.useHexIp">
				<div class="connect-row">
					<label for="connect:username">Username</label>
					<input
						id="connect:username"
						ref="usernameInput"
						class="input username"
						name="username"
						:value="defaults.username"
						maxlength="100"
					/>
				</div>
			</template>
			<div class="connect-row">
				<label for="connect:password">Password</label>
				<RevealPassword v-slot:default="slotProps" class="input-wrap password-container">
					<input
						id="connect:password"
						v-model="defaults.password"
						class="input"
						:type="slotProps.isVisible ? 'text' : 'password'"
						name="password"
						maxlength="300"
					/>
				</RevealPassword>
			</div>
			<div class="connect-row">
				<label for="connect:realname">Real name</label>
				<input
					id="connect:realname"
					class="input"
					name="realname"
					:value="defaults.realname"
					maxlength="300"
				/>
			</div>
			<template v-if="defaults.uuid">
				<div class="connect-row">
					<label for="connect:commands">Commands</label>
					<textarea
						id="connect:commands"
						class="input"
						name="commands"
						placeholder="One /command per line, each command will be executed in the server tab on new connection"
						:value="defaults.commands ? defaults.commands.join('\n') : ''"
					/>
				</div>
				<div>
					<button type="submit" class="btn" :disabled="disabled ? true : false">
						Save
					</button>
				</div>
			</template>
			<template v-else>
				<div class="connect-row">
					<label for="connect:channels">Channels</label>
					<input id="connect:channels" class="input" name="join" :value="defaults.join" />
				</div>
				<div>
					<button type="submit" class="btn" :disabled="disabled ? true : false">
						Connect
					</button>
				</div>
			</template>
		</form>
	</div>
</template>

<script>
import RevealPassword from "./RevealPassword.vue";
import SidebarToggle from "./SidebarToggle.vue";

export default {
	name: "NetworkForm",
	components: {
		RevealPassword,
		SidebarToggle,
	},
	props: {
		handleSubmit: Function,
		defaults: Object,
		disabled: Boolean,
	},
	data() {
		return {
			config: this.$store.state.serverConfiguration,
			previousUsername: this.defaults.username,
		};
	},
	methods: {
		onNickChanged(event) {
			// Username input is not available when useHexIp is set
			if (!this.$refs.usernameInput) {
				return;
			}

			if (
				!this.$refs.usernameInput.value ||
				this.$refs.usernameInput.value === this.previousUsername
			) {
				this.$refs.usernameInput.value = event.target.value;
			}

			this.previousUsername = event.target.value;
		},
		onSecureChanged(event) {
			const ports = ["6667", "6697"];
			const newPort = event.target.checked ? 0 : 1;

			// If you disable TLS and current port is 6697,
			// set it to 6667, and vice versa
			if (this.$refs.serverPort.value === ports[newPort]) {
				this.$refs.serverPort.value = ports[1 - newPort];
			}
		},
		onSubmit(event) {
			const formData = new FormData(event.target);
			const data = {};

			for (const item of formData.entries()) {
				data[item[0]] = item[1];
			}

			this.handleSubmit(data);
		},
	},
};
</script>
