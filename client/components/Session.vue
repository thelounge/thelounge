<template>
	<div class="session-item">
		<div class="session-item-info">
			<strong>{{ session.agent }}</strong>

			<a :href="'https://ipinfo.io/' + session.ip" target="_blank" rel="noopener">{{
				session.ip
			}}</a>

			<template v-if="!session.current">
				<p v-if="session.active">
					<em>Currently active</em>
				</p>
				<p v-else>
					Last used on <time>{{ lastUse }}</time>
				</p>
			</template>
		</div>
		<div class="session-item-btn">
			<button class="btn" @click.prevent="signOut">
				<template v-if="session.current">Sign out</template>
				<template v-else>Revoke</template>
			</button>
		</div>
	</div>
</template>

<script>
import localetime from "../js/helpers/localetime";
import Auth from "../js/auth";
import socket from "../js/socket";

export default {
	name: "Session",
	props: {
		session: Object,
	},
	computed: {
		lastUse() {
			return localetime(this.session.lastUse);
		},
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
