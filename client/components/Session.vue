<template>
	<div class="session-item">
		<div class="session-item-info">
			<strong>{{ session.agent }}</strong>

			<a :href="'https://ipinfo.io/' + session.ip" target="_blank" rel="noopener">{{
				session.ip
			}}</a>

			<p v-if="session.active > 1" class="session-usage">
				Active in {{ session.active }} browsers
			</p>
			<p v-else-if="!session.current && !session.active" class="session-usage">
				Last used on <time>{{ lastUse }}</time>
			</p>
		</div>
		<div class="session-item-btn">
			<button class="btn" @click.prevent="signOut">
				<template v-if="session.current">Sign out</template>
				<template v-else>Revoke</template>
			</button>
		</div>
	</div>
</template>

<style>
.session-list .session-item {
	display: flex;
	font-size: 14px;
}

.session-list .session-item-info {
	display: flex;
	flex-direction: column;
	flex-grow: 1;
}

.session-list .session-item-btn {
	flex-shrink: 0;
}

.session-list .session-usage {
	font-style: italic;
	color: var(--body-color-muted);
}
</style>

<script lang="ts">
import {computed, defineComponent, PropType} from "vue";
import localetime from "../js/helpers/localetime";
import Auth from "../js/auth";
import socket from "../js/socket";
import {ClientSession} from "../js/store";

export default defineComponent({
	name: "Session",
	props: {
		session: {
			type: Object as PropType<ClientSession>,
			required: true,
		},
	},
	setup(props) {
		const lastUse = computed(() => {
			return localetime(props.session.lastUse);
		});

		const signOut = () => {
			if (!props.session.current) {
				socket.emit("sign-out", props.session.token);
			} else {
				socket.emit("sign-out");
				Auth.signout();
			}
		};

		return {
			lastUse,
			signOut,
		};
	},
});
</script>
