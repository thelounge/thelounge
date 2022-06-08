<template>
	<div
		v-if="isOpen"
		id="context-menu-container"
		:class="{passthrough}"
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
			:style="{
				top: style.top + 'px',
				left: style.left + 'px',
			}"
			tabindex="-1"
			@mouseleave="activeItem = -1"
			@keydown.enter.prevent="clickActiveItem"
		>
			<!-- TODO: type -->
			<template v-for="(item, id) of (items as any)" :key="item.name">
				<li
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

<script lang="ts">
import {
	generateUserContextMenu,
	generateChannelContextMenu,
	generateInlineChannelContextMenu,
	ContextMenuItem,
} from "../js/helpers/contextMenu";
import eventbus from "../js/eventbus";
import {defineComponent, nextTick, onMounted, onUnmounted, PropType, ref} from "vue";
import {ClientChan, ClientMessage, ClientNetwork, ClientUser} from "../js/types";
import {useStore} from "../js/store";
import {useRouter} from "vue-router";

export default defineComponent({
	name: "ContextMenu",
	props: {
		message: {
			required: false,
			type: Object as PropType<ClientMessage>,
		},
	},
	setup() {
		const store = useStore();
		const router = useRouter();

		const isOpen = ref(false);
		const passthrough = ref(false);

		const contextMenu = ref<HTMLUListElement | null>();
		const previousActiveElement = ref<HTMLElement | null>();
		const items = ref<ContextMenuItem[]>([]);
		const activeItem = ref(-1);
		const style = ref({
			top: 0,
			left: 0,
		});

		const close = () => {
			if (!isOpen.value) {
				return;
			}

			isOpen.value = false;
			items.value = [];

			if (previousActiveElement.value) {
				previousActiveElement.value.focus();
				previousActiveElement.value = null;
			}
		};

		const enablePointerEvents = () => {
			passthrough.value = false;
			document.body.removeEventListener("pointerup", enablePointerEvents);
		};

		const containerClick = (event: MouseEvent) => {
			if (event.currentTarget === event.target) {
				close();
			}
		};

		const positionContextMenu = (event: MouseEvent) => {
			const element = event.target as HTMLElement;

			if (!contextMenu.value) {
				return;
			}

			const menuWidth = contextMenu.value?.offsetWidth;
			const menuHeight = contextMenu.value?.offsetHeight;

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
		};

		const hoverItem = (id: number) => {
			activeItem.value = id;
		};

		const clickItem = (item: ContextMenuItem) => {
			close();

			if ("action" in item && item.action) {
				item.action();
			} else if ("link" in item && item.link) {
				router.push(item.link).catch(() => {
					// eslint-disable-next-line no-console
					console.error("Failed to navigate to", item.link);
				});
			}
		};

		const clickActiveItem = () => {
			if (items.value[activeItem.value]) {
				clickItem(items.value[activeItem.value]);
			}
		};

		const open = (event: MouseEvent, newItems: ContextMenuItem[]) => {
			event.preventDefault();

			previousActiveElement.value = document.activeElement as HTMLElement;
			items.value = newItems;
			activeItem.value = 0;
			isOpen.value = true;

			// Position the menu and set the focus on the first item after it's size has updated
			nextTick(() => {
				const pos = positionContextMenu(event);

				if (!pos) {
					return;
				}

				style.value.left = pos.left;
				style.value.top = pos.top;
				contextMenu.value?.focus();
			}).catch((e) => {
				// eslint-disable-next-line no-console
				console.error(e);
			});
		};

		const openChannelContextMenu = (data: {
			event: MouseEvent;
			channel: ClientChan;
			network: ClientNetwork;
		}) => {
			if (data.event.type === "contextmenu") {
				// Pass through all pointer events to allow the network list's
				// dragging events to continue triggering.
				passthrough.value = true;
				document.body.addEventListener("pointerup", enablePointerEvents, {
					passive: true,
				});
			}

			const newItems = generateChannelContextMenu(data.channel, data.network);
			open(data.event, newItems);
		};

		const openInlineChannelContextMenu = (data: {channel: string; event: MouseEvent}) => {
			const {network} = store.state.activeChannel;
			const newItems = generateInlineChannelContextMenu(store, data.channel, network);

			open(data.event, newItems);
		};

		const openUserContextMenu = (data: {
			user: Pick<ClientUser, "nick" | "modes">;
			event: MouseEvent;
		}) => {
			const {network, channel} = store.state.activeChannel;

			const newItems = generateUserContextMenu(
				store,
				channel,
				network,
				channel.users.find((u) => u.nick === data.user.nick) || {
					nick: data.user.nick,
					modes: [],
				}
			);
			open(data.event, newItems);
		};

		const navigateMenu = (direction: number) => {
			let currentIndex = activeItem.value;

			currentIndex += direction;

			const nextItem = items.value[currentIndex];

			// If the next item we would select is a divider, skip over it
			if (nextItem && "type" in nextItem && nextItem.type === "divider") {
				currentIndex += direction;
			}

			if (currentIndex < 0) {
				currentIndex += items.value.length;
			}

			if (currentIndex > items.value.length - 1) {
				currentIndex -= items.value.length;
			}

			activeItem.value = currentIndex;
		};

		onMounted(() => {
			eventbus.on("escapekey", close);
			eventbus.on("contextmenu:cancel", close);
			eventbus.on("contextmenu:user", openUserContextMenu);
			eventbus.on("contextmenu:channel", openChannelContextMenu);
			eventbus.on("contextmenu:inline-channel", openInlineChannelContextMenu);
		});

		onUnmounted(() => {
			eventbus.off("escapekey", close);
			eventbus.off("contextmenu:cancel", close);
			eventbus.off("contextmenu:user", openUserContextMenu);
			eventbus.off("contextmenu:channel", openChannelContextMenu);
			eventbus.off("contextmenu:inline-channel", openInlineChannelContextMenu);

			close();
		});

		return {
			isOpen,
			items,
			activeItem,
			style,
			contextMenu,
			passthrough,
			close,
			containerClick,
			navigateMenu,
			hoverItem,
			clickItem,
			clickActiveItem,
		};
	},
});
</script>
