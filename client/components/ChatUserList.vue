<template>
	<aside class="userlist">
		<div class="count">
			<input
				:placeholder="channel.users.length + ' user' + (channel.users.length === 1 ? '' : 's')"
				type="search"
				class="search"
				aria-label="Search among the user list"
				tabindex="-1">
		</div>
		<div class="names">
			<div
				v-for="(users, mode) in groupedUsers"
				:key="mode"
				:class="['user-mode', getModeClass(mode)]">
				<Username
					v-for="user in users"
					:key="user.nick"
					:user="user"/>
			</div>
		</div>
	</aside>
</template>

<script>
import Username from "./Username.vue";

const modes = {
	"~": "owner",
	"&": "admin",
	"!": "admin",
	"@": "op",
	"%": "half-op",
	"+": "voice",
	"": "normal",
};

export default {
	name: "ChatUserList",
	components: {
		Username,
	},
	props: {
		channel: Object,
	},
	computed: {
		groupedUsers() {
			const groups = {};

			for (const user of this.channel.users) {
				if (!groups[user.mode]) {
					groups[user.mode] = [user];
				} else {
					groups[user.mode].push(user);
				}
			}

			return groups;
		},
	},
	methods: {
		getModeClass(mode) {
			return modes[mode];
		},
	},
};
</script>
