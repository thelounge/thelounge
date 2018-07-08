<template>
	<aside class="userlist">
		<div class="count">
			<input
				:placeholder="channel.users.length + ' user' + (channel.users.length === 1 ? '' : 's')"
				v-model="userSearchInput"
				type="search"
				class="search"
				aria-label="Search among the user list"
				tabindex="-1"
			>
		</div>
		<div class="names">
			<div
				v-for="(users, mode) in groupedUsers"
				:key="mode"
				:class="['user-mode', getModeClass(mode)]"
			>
				<template v-if="userSearchInput.length > 0">
					<UsernameFiltered
						v-for="user in users"
						:key="user.original.nick"
						:user="user"/>
				</template>
				<template v-else>
					<Username
						v-for="user in users"
						:key="user.nick"
						:user="user"/>
				</template>
			</div>
		</div>
	</aside>
</template>

<script>
const fuzzy = require("fuzzy");
import Username from "./Username.vue";
import UsernameFiltered from "./UsernameFiltered.vue";

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
		UsernameFiltered,
	},
	props: {
		channel: Object,
	},
	data() {
		return {
			userSearchInput: "",
		};
	},
	computed: {
		groupedUsers() {
			const groups = {};

			if (this.userSearchInput) {
				const result = fuzzy.filter(
					this.userSearchInput,
					this.channel.users,
					{
						pre: "<b>",
						post: "</b>",
						extract: (u) => u.nick,
					}
				);

				for (const user of result) {
					if (!groups[user.original.mode]) {
						groups[user.original.mode] = [];
					}

					groups[user.original.mode].push(user);
				}
			} else {
				for (const user of this.channel.users) {
					if (!groups[user.mode]) {
						groups[user.mode] = [user];
					} else {
						groups[user.mode].push(user);
					}
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
