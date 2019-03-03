<template>
	<p>
		<button
			class="btn pull-right remove-session"
			@click.prevent="signOut"
		>
			<template v-if="session.current">
				Sign out
			</template>
			<template v-else>
				Revoke
			</template>
		</button>

		<strong>{{ session.agent }}</strong>

		<a
			:href="'https://ipinfo.io/'+session.ip"
			target="_blank"
			rel="noopener"
		>{{ session.ip }}</a>

		<template v-if="!session.current">
			<br>
			<template v-if="session.active">
				<em>Currently active</em>
			</template>
			<template v-else>
				Last used on <time>{{ session.lastUse | localetime }}</time>
			</template>
		</template>
	</p>
</template>

<script>
const Auth = require("../js/auth");
const socket = require("../js/socket");

export default {
	name: "Session",
	props: {
		session: Object,
	},
	methods: {
		signOut() {
			if (!this.session.current) {
				socket.emit("sign-out", this.session.token);
			} else {
				socket.emit("sign-out");
				Auth.signout();
			}
		},
	},
};
</script>
