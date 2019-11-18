<template>
	<div v-if="isOpen" id="context-menu-container" @click="close" @contextmenu.prevent="close">
		<ul id="context-menu" ref="contextMenu" role="menu" :style="style">
			<li
				v-for="item of items"
				:key="item.name"
				:class="[
					'context-menu-' + item.type,
					item.class ? 'context-menu-' + item.class : null,
				]"
				tabindex="0"
				role="menuitem"
				@click="clickItem(item)"
			>
				{{ item.label }}
			</li>
		</ul>
	</div>
</template>

<script>
import Mousetrap from "mousetrap";

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
			style: {
				left: 0,
				top: 0,
			},
		};
	},
	mounted() {
		Mousetrap.bind("esc", this.close);

		const trap = Mousetrap(this.$refs.contextMenu);

		trap.bind(["up", "down"], (e, key) => {
			if (!this.isOpen) {
				return;
			}

			const items = this.$refs.contextMenu.querySelectorAll(".context-menu-item");
			let index = Array.from(items).findIndex((item) => item === document.activeElement);

			if (key === "down") {
				index = (index + 1) % items.length;
			} else {
				index = Math.max(index, 0) - 1;

				if (index < 0) {
					index = items.length + index;
				}
			}

			items[index].focus();
		});

		trap.bind("enter", () => {
			if (!this.isOpen) {
				return;
			}

			const item = this.$refs.contextMenu.querySelector(":focus");
			item.click();

			return false;
		});
	},
	destroyed() {
		Mousetrap.unbind("esc", this.close);
	},
	methods: {
		open(event, items) {
			this.items = items;
			this.isOpen = true;
			this.previousActiveElement = document.activeElement;

			// Position the menu and set the focus on the first item after it's size has updated
			this.$nextTick(() => {
				const pos = this.positionContextMenu(event);
				this.style.left = pos.left + "px";
				this.style.top = pos.top + "px";

				this.$refs.contextMenu.querySelector(".context-menu-item:first-child").focus();
			});
		},
		close() {
			if (!this.isOpen) {
				return;
			}

			this.isOpen = false;

			if (this.previousActiveElement) {
				this.previousActiveElement.focus();
				this.previousActiveElement = null;
			}
		},
		clickItem(item) {
			if (item.action) {
				item.action();
			} else if (item.link) {
				this.$router.push(item.link);
			}
		},
		positionContextMenu(event) {
			const element = event.target;
			const menuWidth = this.$refs.contextMenu.offsetWidth;
			const menuHeight = this.$refs.contextMenu.offsetHeight;

			if (element.classList.contains("menu")) {
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
