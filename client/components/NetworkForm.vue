<template>
	<div
		id="connect"
		class="window"
		role="tabpanel"
		aria-label="Connect"
	>
		<div class="header">
			<button
				class="lt"
				aria-label="Toggle channel list"
			/>
		</div>
		<form
			class="container"
			method="post"
			action=""
			@submit.prevent="onSubmit"
		>
			<div class="row">
				<div class="col-sm-12">
					<h1 class="title">
						<template v-if="defaults.uuid">
							<input
								type="hidden"
								name="uuid"
								:value="defaults.uuid"
							>
							Edit {{ defaults.name }}
						</template>
						<template v-else>
							<template v-if="config.public">The Lounge - </template>
							Connect
							<template v-if="!config.displayNetwork">
								<template v-if="config.lockNetwork">
									to {{ defaults.name }}
								</template>
							</template>
						</template>
					</h1>
				</div>
				<template v-if="config.displayNetwork">
					<div>
						<div class="col-sm-12">
							<h2>Network settings</h2>
						</div>
						<div class="col-sm-3">
							<label for="connect:name">Name</label>
						</div>
						<div class="col-sm-9">
							<input
								id="connect:name"
								class="input"
								name="name"
								:value="defaults.name"
								maxlength="100"
							>
						</div>
						<div class="col-sm-3">
							<label for="connect:host">Server</label>
						</div>
						<div class="col-sm-6 col-xs-8">
							<input
								id="connect:host"
								class="input"
								name="host"
								:value="defaults.host"
								aria-label="Server address"
								maxlength="255"
								required
								:disabled="config.lockNetwork ? true : false"
							>
						</div>
						<div class="col-sm-3 col-xs-4">
							<div class="port">
								<input
									class="input"
									type="number"
									min="1"
									max="65535"
									name="port"
									:value="defaults.port"
									aria-label="Server port"
									:disabled="config.lockNetwork ? true : false"
								>
							</div>
						</div>
						<div class="clearfix" />
						<div class="col-sm-9 col-sm-offset-3">
							<label class="tls">
								<input
									type="checkbox"
									name="tls"
									:checked="defaults.tls ? true : false"
									:disabled="config.lockNetwork ? true : false"
								>
								Use secure connection (TLS)
							</label>
						</div>
						<div class="col-sm-9 col-sm-offset-3">
							<label class="tls">
								<input
									type="checkbox"
									name="rejectUnauthorized"
									:checked="defaults.rejectUnauthorized ? true : false"
									:disabled="config.lockNetwork ? true : false"
								>
								Only allow trusted certificates
							</label>
						</div>
						<div class="clearfix" />
					</div>
				</template>
				<div class="col-sm-12">
					<h2>User preferences</h2>
				</div>
				<div class="col-sm-3">
					<label for="connect:nick">Nick</label>
				</div>
				<div class="col-sm-9">
					<input
						id="connect:nick"
						class="input nick"
						name="nick"
						:value="defaults.nick"
						maxlength="100"
						required
					>
				</div>
				<template v-if="!config.useHexIp">
					<div class="col-sm-3">
						<label for="connect:username">Username</label>
					</div>
					<div class="col-sm-9">
						<input
							id="connect:username"
							class="input username"
							name="username"
							:value="defaults.username"
							maxlength="512"
						>
					</div>
				</template>
				<div class="col-sm-3">
					<label for="connect:password">Password</label>
				</div>
				<div class="col-sm-9 password-container">
					<RevealPassword v-slot:default="slotProps">
						<input
							id="connect:password"
							v-model="defaults.password"
							class="input"
							:type="slotProps.isVisible ? 'text' : 'password'"
							name="password"
							maxlength="512"
						>
					</RevealPassword>
				</div>
				<div class="col-sm-3">
					<label for="connect:realname">Real name</label>
				</div>
				<div class="col-sm-9">
					<input
						id="connect:realname"
						class="input"
						name="realname"
						:value="defaults.realname"
						maxlength="512"
					>
				</div>
				<template v-if="defaults.uuid">
					<div class="col-sm-3">
						<label for="connect:commands">Commands</label>
					</div>
					<div class="col-sm-9">
						<textarea
							id="connect:commands"
							class="input"
							name="commands"
							placeholder="One raw command per line, each command will be executed on new connection"
							:value="defaults.commands ? defaults.commands.join('\n') : ''"
						/>
					</div>
					<div class="col-sm-9 col-sm-offset-3">
						<button
							type="submit"
							class="btn"
							:disabled="disabled ? true : false"
						>Save</button>
					</div>
				</template>
				<template v-else>
					<div class="col-sm-3">
						<label for="connect:channels">Channels</label>
					</div>
					<div class="col-sm-9">
						<input
							id="connect:channels"
							class="input"
							name="join"
							:value="defaults.join"
						>
					</div>
					<div class="col-sm-9 col-sm-offset-3">
						<button
							type="submit"
							class="btn"
							:disabled="disabled ? true : false"
						>Connect</button>
					</div>
				</template>
			</div>
		</form>

	</div>
</template>

<script>
import RevealPassword from "./RevealPassword.vue";

export default {
	name: "NetworkForm",
	components: {
		RevealPassword,
	},
	props: {
		handleSubmit: Function,
		defaults: Object,
		disabled: Boolean,
	},
	data() {
		return {
			config: this.$root.serverConfiguration,
		};
	},
	methods: {
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
