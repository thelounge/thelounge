<template>
	<aside
		ref="userlist"
		class="userlist"
		:aria-label="'User list for ' + channel.name"
		@mouseleave="removeHoverUser"
	>
		<div class="count">
			<input
				ref="input"
				:value="userSearchInput"
				:placeholder="
					channel.users.length + ' user' + (channel.users.length === 1 ? '' : 's')
				"
				type="search"
				class="search"
				aria-label="Search among the user list"
				tabindex="-1"
				@input="setUserSearchInput"
				@keydown.up="navigateUserList($event, -1)"
				@keydown.down="navigateUserList($event, 1)"
				@keydown.page-up="navigateUserList($event, -10)"
				@keydown.page-down="navigateUserList($event, 10)"
				@keydown.enter="selectUser"
			/>
		</div>
		<div class="names">
			<!-- Custom groups from SPGROUPS -->
			<template v-if="hasCustomGroups">
				<div
					v-for="group in sortedGroups"
					:key="'group-' + group.name"
					:class="['user-mode', 'custom-group', 'group-' + slugify(group.name)]"
				>
					<div
						v-if="getGroupUsers(group.name).length > 0"
						:class="['custom-group-header', 'group-header-' + slugify(group.name)]"
					>
						{{ group.name }}
					</div>
					<template v-if="userSearchInput.length > 0">
						<!-- eslint-disable vue/no-v-text-v-html-on-component -->
						<Username
							v-for="user in getGroupUsers(group.name)"
							:key="user.original.nick + '-search'"
							:on-hover="hoverUser"
							:active="user.original === activeUser"
							:user="user.original"
							v-html="user.string"
						/>
						<!-- eslint-enable -->
					</template>
					<template v-else>
						<Username
							v-for="user in getGroupUsers(group.name)"
							:key="user.nick"
							:on-hover="hoverUser"
							:active="user === activeUser"
							:user="user"
						/>
					</template>
				</div>
			</template>
			<!-- Default IRC modes fallback -->
			<template v-else>
				<div
					v-for="(users, mode) in groupedUsers"
					:key="mode"
					:class="['user-mode', getModeClass(String(mode))]"
				>
					<template v-if="userSearchInput.length > 0">
						<!-- eslint-disable vue/no-v-text-v-html-on-component -->
						<Username
							v-for="user in users"
							:key="user.original.nick + '-search'"
							:on-hover="hoverUser"
							:active="user.original === activeUser"
							:user="user.original"
							v-html="user.string"
						/>
						<!-- eslint-enable -->
					</template>
					<template v-else>
						<Username
							v-for="user in users"
							:key="user.nick"
							:on-hover="hoverUser"
							:active="user === activeUser"
							:user="user"
						/>
					</template>
				</div>
			</template>
		</div>
	</aside>
</template>

<style lang="css" scoped>
.custom-group-header {
	background: var(--window-bg-color);
	color: var(--body-color-muted);
	display: flex;
	font-weight: 700;
	padding: 8px 14px 8px 10px;
	position: sticky;
	top: 0;

	&::before {
		font-weight: 900;
		font-family: "Font Awesome 6 Pro";
		display: var(--fa-display, inline-block);
		font-style: normal;
		font-variant: normal;
		text-rendering: auto;
		margin-right: 6px;
		align-self: center;
	}

	&::after {
		content: "";
		height: 1px;
		background: currentColor;
		margin: 0 0 0 10px;
		opacity: 0.5;
		flex-grow: 1;
		align-self: center;
	}
}

.group-header-bot {
	color: rgb(255, 215, 0);

	&::before {
		content: "\e4e2";
	}
}

.group-header-sysop {
	color: rgb(255, 0, 0);

	&::before {
		content: "\f43f";
	}
}

.group-header-administrator {
	color: rgb(242, 59, 22);

	&::before {
		content: "\f445";
	}
}


.group-header-moderator {
	color: rgb(201, 26, 26);

	&::before {
		content: "\f447";
	}
}

.group-header-fls {
	color: rgb(255, 211, 156);

	&::before {
		content: "\f132";
	}
}

.group-header-editor {
	color: rgb(21, 176, 151);

	&::before {
		content: "\f336";
	}
}

.group-header-internal {
	color: rgb(255, 77, 77);

	&::before {
		content: "\e4e2";
	}
}

.group-header-uploader {
	color: rgb(46, 204, 113);

	&::before {
		content: "\f093";
	}
}

.group-header-external {
	color: rgb(0, 153, 255);

	&::before {
		content: "\f54c";
	}
}

.group-header-specialpool {
	color: rgb(255, 215, 0);

	&::before {
		content: "\e4e2";
	}
}

.group-header-foundingpool {
	color: rgb(255, 132, 9);

	&::before {
		content: "\f43a";
	}
}

.group-header-godpool {
	color: rgb(212, 172, 13);

	&::before {
		content: "\e4e2";
	}
}

.group-header-megapool {
	color: rgb(224, 138, 78);

	&::before {
		content: "\e4e2";
	}
}

.group-header-propool {
	color: rgb(255, 215, 0);

	&::before {
		content: "\f51e";
	}
}

.group-header-uberpool {
	color: rgb(255, 255, 128);

	&::before {
		content: "\f447";
	}
}

.group-header-superpool {
	color: rgb(255, 132, 9);

	&::before {
		content: "\f441";
	}
}

.group-header-powerpool {
	color: rgb(17, 85, 204);

	&::before {
		content: "\f441";
	}
}

.group-header-pool {
	color: rgb(99, 230, 190);

	&::before {
		content: "\f439";
	}
}

.group-header-user {
	color: rgb(114, 137, 218);

	&::before {
		content: "\f443";
	}
}

.group-header-kiddiepool {
	color: rgb(48, 47, 145);

	&::before {
		content: "\f77c";
	}
}

.group-header-validating {
	color: rgb(149, 165, 166);

	&::before {
		content: "\f059";
	}
}

.group-header-cesspool {
	color: rgb(150, 75, 0);

	&::before {
		content: "\f619";
	}
}

.group-header-idlepool {
	color: rgb(87, 87, 87);

	&::before {
		content: "\f1da";
	}
}

.group-header-guest {
	color: rgb(87, 87, 87);

	&::before {
		content: "\f059";
	}
}

.group-header-leech {
	color: rgb(150, 40, 27);

	&::before {
		content: "\f00d";
	}
}

.group-header-banned {
	color: rgb(255, 0, 0);

	&::before {
		content: "\f05e";
	}
}

.group-header-disabled {
	color: rgb(141, 98, 98);

	&::before {
		content: "\f28b";
	}
}

.group-header-pruned {
	color: rgb(141, 98, 98);

	&::before {
		content: "\f057";
	}
}
</style>

<script lang="ts">
import {filter as fuzzyFilter} from "fuzzy";
import {computed, defineComponent, nextTick, PropType, ref} from "vue";
import type {UserInMessage} from "../../shared/types/msg";
import type {ClientChan, ClientUser} from "../js/types";
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

export default defineComponent({
	name: "ChatUserList",
	components: {
		Username,
	},
	props: {
		channel: {type: Object as PropType<ClientChan>, required: true},
	},
	setup(props) {
		const userSearchInput = ref("");
		const activeUser = ref<UserInMessage | null>();
		const userlist = ref<HTMLDivElement>();

		// Check if we have custom groups from SPGROUPS
		const hasCustomGroups = computed(() => {
			return props.channel.groups && props.channel.groups.length > 0;
		});

		// Sort groups by position (highest first)
		const sortedGroups = computed(() => {
			if (!props.channel.groups) return [];
			return [...props.channel.groups].sort((a, b) => b.position - a.position);
		});

		// Create a set of users in each group for quick lookup
		const groupUsersMap = computed(() => {
			const map: Record<string, Set<string>> = {};

			if (props.channel.groups) {
				for (const group of props.channel.groups) {
					map[group.name] = new Set(group.users.map(u => u.toLowerCase()));
				}
			}

			return map;
		});

		const filteredUsers = computed(() => {
			if (!userSearchInput.value) {
				return;
			}

			return fuzzyFilter(userSearchInput.value, props.channel.users, {
				pre: "<b>",
				post: "</b>",
				extract: (u) => u.nick,
			});
		});

		// Get users for a specific group
		const getGroupUsers = (groupName: string) => {
			const groupUserSet = groupUsersMap.value[groupName];

			if (!groupUserSet) {
				return [];
			}

			if (userSearchInput.value && filteredUsers.value) {
				return filteredUsers.value.filter(user =>
					groupUserSet.has(user.original.nick.toLowerCase())
				);
			}

			return props.channel.users.filter(user =>
				groupUserSet.has(user.nick.toLowerCase())
			);
		};

		// Convert group name to CSS-safe class name
		const slugify = (name: string) => {
			return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
		};

		const groupedUsers = computed(() => {
			const groups = {};

			if (userSearchInput.value && filteredUsers.value) {
				const result = filteredUsers.value;

				for (const user of result) {
					const mode: string = user.original.modes[0] || "";

					if (!groups[mode]) {
						groups[mode] = [];
					}

					// Prepend user mode to search result
					user.string = mode + user.string;

					groups[mode].push(user);
				}
			} else {
				for (const user of props.channel.users) {
					const mode = user.modes[0] || "";

					if (!groups[mode]) {
						groups[mode] = [user];
					} else {
						groups[mode].push(user);
					}
				}
			}

			return groups as {
				[mode: string]: (ClientUser & {
					original: UserInMessage;
					string: string;
				})[];
			};
		});

		const setUserSearchInput = (e: Event) => {
			userSearchInput.value = (e.target as HTMLInputElement).value;
		};

		const getModeClass = (mode: string) => {
			return modes[mode] as typeof modes;
		};

		const selectUser = () => {
			// Simulate a click on the active user to open the context menu.
			// Coordinates are provided to position the menu correctly.
			if (!activeUser.value || !userlist.value) {
				return;
			}

			const el = userlist.value.querySelector(".active");

			if (!el) {
				return;
			}

			const rect = el.getBoundingClientRect();
			const ev = new MouseEvent("click", {
				view: window,
				bubbles: true,
				cancelable: true,
				clientX: rect.left,
				clientY: rect.top + rect.height,
			});
			el.dispatchEvent(ev);
		};

		const hoverUser = (user: UserInMessage) => {
			activeUser.value = user;
		};

		const removeHoverUser = () => {
			activeUser.value = null;
		};

		const scrollToActiveUser = () => {
			// Scroll the list if needed after the active class is applied
			void nextTick(() => {
				const el = userlist.value?.querySelector(".active");
				el?.scrollIntoView({block: "nearest", inline: "nearest"});
			});
		};

		const navigateUserList = (event: Event, direction: number) => {
			// Prevent propagation to stop global keybind handler from capturing pagedown/pageup
			// and redirecting it to the message list container for scrolling
			event.stopImmediatePropagation();
			event.preventDefault();

			let users = props.channel.users;

			// Only using filteredUsers when we have to avoids filtering when it's not needed
			if (userSearchInput.value && filteredUsers.value) {
				users = filteredUsers.value.map((result) => result.original);
			}

			// Bail out if there's no users to select
			if (!users.length) {
				activeUser.value = null;
				return;
			}

			const abort = () => {
				activeUser.value = direction ? users[0] : users[users.length - 1];
				scrollToActiveUser();
			};

			// If there's no active user select the first or last one depending on direction
			if (!activeUser.value) {
				abort();
				return;
			}

			let currentIndex = users.indexOf(activeUser.value as ClientUser);

			if (currentIndex === -1) {
				abort();
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

			activeUser.value = users[currentIndex];
			scrollToActiveUser();
		};

		return {
			filteredUsers,
			groupedUsers,
			hasCustomGroups,
			sortedGroups,
			userSearchInput,
			activeUser,
			userlist,

			getGroupUsers,
			slugify,
			setUserSearchInput,
			getModeClass,
			selectUser,
			hoverUser,
			removeHoverUser,
			navigateUserList,
		};
	},
});
</script>
