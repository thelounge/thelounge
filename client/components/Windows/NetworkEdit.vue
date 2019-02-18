<template>
	<div
		id="connect"
		class="window"
		role="tabpanel"
		aria-label="Connect">
		<div class="header">
			<button
				class="lt"
				aria-label="Toggle channel list" />
		</div>
		<form
			class="container"
			method="post"
			action=""
			data-event="{{#if defaults.uuid}}network:edit{{else}}network:new{{/if}}">
			<div class="row">
				<div class="col-sm-12">
					<h1 class="title">
						{{#if defaults.uuid}}
						<input
							type="hidden"
							name="uuid"
							value="{{defaults.uuid}}">

						Edit {{ defaults.name }}
						{{else}}
						{{#if public}}The Lounge - {{/if}}
						Connect
						{{#unless displayNetwork}}
						{{#if lockNetwork}}
						to {{ defaults.name }}
						{{/if}}
						{{/unless}}
						{{/if}}
					</h1>
				</div>
				{{#if displayNetwork}}
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
							value="{{defaults.name}}"
							maxlength="100">
					</div>
					<div class="col-sm-3">
						<label for="connect:host">Server</label>
					</div>
					<div class="col-sm-6 col-xs-8">
						<input
							id="connect:host"
							class="input"
							name="host"
							value="{{defaults.host}}"
							aria-label="Server address"
							maxlength="255"
							required
							{{#if
							lockNetwork}}disabled{{
							if}}>
					</div>
					<div class="col-sm-3 col-xs-4">
						<div class="port">
							<input
								class="input"
								type="number"
								min="1"
								max="65535"
								name="port"
								value="{{defaults.port}}"
								aria-label="Server port"
								{{#if
								lockNetwork}}disabled{{
								if}}>
						</div>
					</div>
					<div class="clearfix" />
					<div class="col-sm-9 col-sm-offset-3">
						<label class="tls">
							<input
								type="checkbox"
								name="tls"
								{{#if
								defaults.tls}}checked{{
								if}}
								{{#if
								lockNetwork}}disabled{{
								if}}>
							Use secure connection (TLS)
						</label>
					</div>
					<div class="col-sm-9 col-sm-offset-3">
						<label class="tls">
							<input
								type="checkbox"
								name="rejectUnauthorized"
								{{#if
								defaults.rejectUnauthorized}}checked{{
								if}}
								{{#if
								lockNetwork}}disabled{{
								if}}>
							Only allow trusted certificates
						</label>
					</div>
					<div class="clearfix" />
				</div>
				{{/if}}
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
						value="{{defaults.nick}}"
						maxlength="100"
						required>
				</div>
				{{#unless useHexIp}}
				<div class="col-sm-3">
					<label for="connect:username">Username</label>
				</div>
				<div class="col-sm-9">
					<input
						id="connect:username"
						class="input username"
						name="username"
						value="{{defaults.username}}"
						maxlength="512">
				</div>
				{{/unless}}
				<div class="col-sm-3">
					<label for="connect:password">Password</label>
				</div>
				<div class="col-sm-9 password-container">
					<input
						id="connect:password"
						class="input"
						type="password"
						name="password"
						value="{{defaults.password}}"
						maxlength="512">
					{{> ../reveal-password}}
				</div>
				<div class="col-sm-3">
					<label for="connect:realname">Real name</label>
				</div>
				<div class="col-sm-9">
					<input
						id="connect:realname"
						class="input"
						name="realname"
						value="{{defaults.realname}}"
						maxlength="512">
				</div>
				{{#if defaults.uuid}}
				<div class="col-sm-3">
					<label for="connect:commands">Commands</label>
				</div>
				<div class="col-sm-9">
					<textarea
						id="connect:commands"
						class="input"
						name="commands"
						placeholder="One raw command per line, each command will be executed on new connection">{{~#each defaults.commands~}}{{ ~this }}
					{{/each~}}</textarea>
				</div>
				<div class="col-sm-9 col-sm-offset-3">
					<button
						type="submit"
						class="btn">Save</button>
				</div>
				{{else}}
				<div class="col-sm-3">
					<label for="connect:channels">Channels</label>
				</div>
				<div class="col-sm-9">
					<input
						id="connect:channels"
						class="input"
						name="join"
						value="{{defaults.join}}">
				</div>
				<div class="col-sm-9 col-sm-offset-3">
					<button
						type="submit"
						class="btn">Connect</button>
				</div>
				{{/if}}
			</div>
		</form>

	</div>
</template>

<script>
const storage = require("../../js/localStorage");
import socket from "../../js/socket";
import RevealPassword from "../RevealPassword.vue";

export default {
	name: "NetworkEdit",
	components: {
		RevealPassword,
	},
	data() {
		return {
			inFlight: false,
			errorShown: false,
		};
	},
	methods: {
		onSubmit(event) {
			event.preventDefault();

			this.inFlight = true;
			this.errorShown = false;

			const values = {
				user: this.$refs.username.value,
				password: this.$refs.password.value,
			};

			storage.set("user", values.user);

			socket.emit("auth", values);
		},
	},
};
</script>
