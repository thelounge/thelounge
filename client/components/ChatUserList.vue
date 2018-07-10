<template>
	<aside
		ref="userlist"
		class="userlist"
	>
		<div class="count">
			<input
				ref="input"
				:placeholder="channel.users.length + ' user' + (channel.users.length === 1 ? '' : 's')"
				v-model="userSearchInput"
				type="search"
				class="search"
				aria-label="Search among the user list"
				tabindex="-1"
				@keydown.up="navigateUserList(-1)"
				@keydown.down="navigateUserList(1)"
				@keydown.page-up="navigateUserList(-10)"
				@keydown.page-down="navigateUserList(10)"
				@keydown.enter="selectUser"
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
						:active="user.original === activeUser"
						:user="user"/>
				</template>
				<template v-else>
					<Username
						v-for="user in users"
						:key="user.nick"
						:active="user === activeUser"
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
			activeUser: null,
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
		selectUser() {
			// Simulate a click on the active user to open the context menu.
			// Coordinates are provided to position the menu correctly.
			if (!this.activeUser) {
				return;
			}

			const el = this.$refs.userlist.querySelector(".active");
			const rect = el.getBoundingClientRect();
			const ev = new MouseEvent("click", {
				view: window,
				bubbles: true,
				cancelable: true,
				clientX: rect.x,
				clientY: rect.y + rect.height,
			});
			el.dispatchEvent(ev);
		},
		navigateUserList(direction) {
			let users = this.channel.users;

			// If a search is active, get the matching user objects
			// TODO: this could probably be cached via `computed`
			//		 to avoid refiltering on each keypress
			if (this.userSearchInput) {
				const results = fuzzy.filter(
					this.userSearchInput,
					this.channel.users,
					{
						extract: (u) => u.nick,
					}
				);
				users = results.map((result) => result.original);
			}

			// Bail out if there's no users to select
			if (!users.length) {
				this.activeUser = null;
				return;
			}

			let currentIndex = users.indexOf(this.activeUser);

			// If there's no active user select the first or last one depending on direction
			if (!this.activeUser || currentIndex === -1) {
				this.activeUser = direction ? users[0] : users[users.length - 1];
				this.scrollToActiveUser();
				return;
			}

			currentIndex += direction;

			// Wrap around the list if necessary. Normaly each loop iterates once at most,
			// but might iterate more often if pgup or pgdown are used in a very short user list
			while (currentIndex < 0) {
				currentIndex += users.length;
			}

			while (currentIndex > users.length - 1) {
				currentIndex -= users.length;
			}

			this.activeUser = users[currentIndex];
			this.scrollToActiveUser();
		},
		scrollToActiveUser() {
			// Scroll the list if needed after the active class is applied
			this.$nextTick(() => {
				const el = this.$refs.userlist.querySelector(".active");
				el.scrollIntoView({block: "nearest", inline: "nearest"});
			});
		},
	},
};
</script>
