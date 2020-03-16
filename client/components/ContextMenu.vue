<template>
	<div
		v-if="isOpen"
		id="context-menu-container"
		@click="containerClick"
		@contextmenu.prevent="containerClick"
		@keydown.exact.up.prevent="navigateMenu(-1)"
		@keydown.exact.down.prevent="navigateMenu(1)"
		@keydown.exact.tab.prevent="navigateMenu(1)"
		@keydown.shift.tab.prevent="navigateMenu(-1)"
	>
		<ul
			id="context-menu"
			ref="contextMenu"
			role="menu"
			:style="style"
			tabindex="-1"
			@mouseleave="activeItem = -1"
			@keydown.enter.prevent="clickActiveItem"
		>
			<template v-for="(item, id) of items">
				<li
					:key="item.name"
					:class="[
						'context-menu-' + item.type,
						item.class ? 'context-menu-' + item.class : null,
						{active: id === activeItem},
					]"
					role="menuitem"
					@mouseenter="hoverItem(id)"
					@click="clickItem(item)"
				>
					{{ item.label }}
				</li>
			</template>
		</ul>
	</div>
</template>

<script>
import {generateUserContextMenu, generateChannelContextMenu} from "../js/helpers/contextMenu.js";
import eventbus from "../js/eventbus";

export default {
	name: "ContextMenu",
	props: {
		message: Object,
	},
	data() {
		return {
			isOpen: false,
			previousActiveElement: null,
			items: [],
			activeItem: -1,
			style: {
				left: 0,
				top: 0,
			},
		};
	},
	mounted() {
		eventbus.on("escapekey", this.close);
		eventbus.on("contextmenu:user", this.openUserContextMenu);
		eventbus.on("contextmenu:channel", this.openChannelContextMenu);
	},
	destroyed() {
		eventbus.off("escapekey", this.close);
		eventbus.off("contextmenu:user", this.openUserContextMenu);
		eventbus.off("contextmenu:channel", this.openChannelContextMenu);

		this.close();
	},
	methods: {
		openChannelContextMenu(data) {
			const items = generateChannelContextMenu(this.$root, data.channel, data.network);
			this.open(data.event, items);
		},
		openUserContextMenu(data) {
			const {network, channel} = this.$store.state.activeChannel;

			const items = generateUserContextMenu(
				this.$root,
				channel,
				network,
				channel.users.find((u) => u.nick === data.user.nick) || {nick: data.user.nick}
			);
			this.open(data.event, items);
		},
		open(event, items) {
			event.preventDefault();

			this.previousActiveElement = document.activeElement;
			this.items = items;
			this.activeItem = 0;
			this.isOpen = true;

			// Position the menu and set the focus on the first item after it's size has updated
			this.$nextTick(() => {
				const pos = this.positionContextMenu(event);
				this.style.left = pos.left + "px";
				this.style.top = pos.top + "px";
				this.$refs.contextMenu.focus();
			});
		},
		close() {
			if (!this.isOpen) {
				return;
			}

			this.isOpen = false;
			this.items = [];

			if (this.previousActiveElement) {
				this.previousActiveElement.focus();
				this.previousActiveElement = null;
			}
		},
		hoverItem(id) {
			this.activeItem = id;
		},
		clickItem(item) {
			this.close();

			if (item.action) {
				item.action();
			} else if (item.link) {
				this.$router.push(item.link);
			}
		},
		clickActiveItem() {
			if (this.items[this.activeItem]) {
				this.clickItem(this.items[this.activeItem]);
			}
		},
		navigateMenu(direction) {
			let currentIndex = this.activeItem;

			currentIndex += direction;

			const nextItem = this.items[currentIndex];

			// If the next item we would select is a divider, skip over it
			if (nextItem && nextItem.type === "divider") {
				currentIndex += direction;
			}

			if (currentIndex < 0) {
				currentIndex += this.items.length;
			}

			if (currentIndex > this.items.length - 1) {
				currentIndex -= this.items.length;
			}

			this.activeItem = currentIndex;
		},
		containerClick(event) {
			if (event.currentTarget === event.target) {
				this.close();
			}
		},
		positionContextMenu(event) {
			const element = event.target;
			const menuWidth = this.$refs.contextMenu.offsetWidth;
			const menuHeight = this.$refs.contextMenu.offsetHeight;

			if (element && element.classList.contains("menu")) {
				return {
					left: element.getBoundingClientRect().left - (menuWidth - element.offsetWidth),
					top: element.getBoundingClientRect().top + element.offsetHeight,
				};
			}

			const offset = {left: event.pageX, top: event.pageY};

			if (window.innerWidth - offset.left < menuWidth) {
				offset.left = window.innerWidth - menuWidth;
			}

			if (window.innerHeight - offset.top < menuHeight) {
				offset.top = window.innerHeight - menuHeight;
			}

			return offset;
		},
	},
};
</script>
