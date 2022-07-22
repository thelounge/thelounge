<template>
	<div
		v-if="store.state.networks.length === 0"
		class="empty"
		role="navigation"
		aria-label="Network and Channel list"
	>
		You are not connected to any networks yet.
	</div>
	<div v-else ref="networklist" role="navigation" aria-label="Network and Channel list">
		<div class="jump-to-input">
			<input
				ref="searchInput"
				:value="searchText"
				placeholder="Jump to..."
				type="search"
				class="search input mousetrap"
				aria-label="Search among the channel list"
				tabindex="-1"
				@input="setSearchText"
				@keydown.up="navigateResults($event, -1)"
				@keydown.down="navigateResults($event, 1)"
				@keydown.page-up="navigateResults($event, -10)"
				@keydown.page-down="navigateResults($event, 10)"
				@keydown.enter="selectResult"
				@keydown.escape="deactivateSearch"
				@focus="activateSearch"
			/>
		</div>
		<div v-if="searchText" class="jump-to-results">
			<div v-if="results.length">
				<div
					v-for="item in results"
					:key="item.channel.id"
					@mouseenter="setActiveSearchItem(item.channel)"
					@click.prevent="selectResult"
				>
					<Channel
						v-if="item.channel.type !== 'lobby'"
						:channel="item.channel"
						:network="item.network"
						:active="item.channel === activeSearchItem"
						:is-filtering="true"
					/>
					<NetworkLobby
						v-else
						:channel="item.channel"
						:network="item.network"
						:active="item.channel === activeSearchItem"
						:is-filtering="true"
					/>
				</div>
			</div>
			<div v-else class="no-results">No results found.</div>
		</div>
		<Draggable
			v-else
			:list="store.state.networks"
			:delay="LONG_TOUCH_DURATION"
			:delay-on-touch-only="true"
			:touch-start-threshold="10"
			handle=".channel-list-item[data-type='lobby']"
			draggable=".network"
			ghost-class="ui-sortable-ghost"
			drag-class="ui-sortable-dragging"
			group="networks"
			class="networks"
			item-key="uuid"
			@change="onNetworkSort"
			@choose="onDraggableChoose"
			@unchoose="onDraggableUnchoose"
		>
			<template v-slot:item="{element: network}">
				<div
					:id="'network-' + network.uuid"
					:key="network.uuid"
					:class="{
						collapsed: network.isCollapsed,
						'not-connected': !network.status.connected,
						'not-secure': !network.status.secure,
					}"
					class="network"
					role="region"
					aria-live="polite"
					@touchstart="onDraggableTouchStart"
					@touchmove="onDraggableTouchMove"
					@touchend="onDraggableTouchEnd"
					@touchcancel="onDraggableTouchEnd"
				>
					<NetworkLobby
						:network="network"
						:is-join-channel-shown="network.isJoinChannelShown"
						:active="
							store.state.activeChannel &&
							network.channels[0] === store.state.activeChannel.channel
						"
						@toggle-join-channel="
							network.isJoinChannelShown = !network.isJoinChannelShown
						"
					/>
					<JoinChannel
						v-if="network.isJoinChannelShown"
						:network="network"
						:channel="network.channels[0]"
						@toggle-join-channel="
							network.isJoinChannelShown = !network.isJoinChannelShown
						"
					/>

					<Draggable
						draggable=".channel-list-item"
						ghost-class="ui-sortable-ghost"
						drag-class="ui-sortable-dragging"
						:group="network.uuid"
						:list="network.channels"
						:delay="LONG_TOUCH_DURATION"
						:delay-on-touch-only="true"
						:touch-start-threshold="10"
						class="channels"
						item-key="name"
						@change="onChannelSort"
						@choose="onDraggableChoose"
						@unchoose="onDraggableUnchoose"
					>
						<template v-slot:item="{element: channel, index}">
							<Channel
								v-if="index > 0"
								:key="channel.id"
								:data-item="channel.id"
								:channel="channel"
								:network="network"
								:active="
									store.state.activeChannel &&
									channel === store.state.activeChannel.channel
								"
							/>
						</template>
					</Draggable>
				</div>
			</template>
		</Draggable>
	</div>
</template>

<style>
.jump-to-input {
	margin: 8px;
	position: relative;
}

.jump-to-input .input {
	margin: 0;
	width: 100%;
	border: 0;
	color: #fff;
	background-color: rgba(255, 255, 255, 0.1);
	padding-right: 35px;
	appearance: none;
}

.jump-to-input .input::placeholder {
	color: rgba(255, 255, 255, 0.35);
}

.jump-to-input::before {
	content: "\f002"; /* http://fontawesome.io/icon/search/ */
	color: rgba(255, 255, 255, 0.35);
	position: absolute;
	right: 8px;
	top: 0;
	bottom: 0;
	pointer-events: none;
	line-height: 35px !important;
}

.jump-to-results {
	margin: 0;
	padding: 0;
	list-style: none;
	overflow: auto;
}

.jump-to-results .no-results {
	margin: 14px 8px;
	text-align: center;
}

.jump-to-results .channel-list-item.active {
	cursor: pointer;
}

.jump-to-results .channel-list-item .add-channel,
.jump-to-results .channel-list-item .close-tooltip {
	display: none;
}

.jump-to-results .channel-list-item[data-type="lobby"] {
	padding: 8px 14px;
}

.jump-to-results .channel-list-item[data-type="lobby"]::before {
	content: "\f233";
}
</style>

<script lang="ts">
import {computed, watch, defineComponent, nextTick, onBeforeUnmount, onMounted, ref} from "vue";

import Mousetrap from "mousetrap";
import Draggable from "./Draggable.vue";
import {filter as fuzzyFilter} from "fuzzy";
import NetworkLobby from "./NetworkLobby.vue";
import Channel from "./Channel.vue";
import JoinChannel from "./JoinChannel.vue";

import socket from "../js/socket";
import collapseNetworkHelper from "../js/helpers/collapseNetwork";
import isIgnoredKeybind from "../js/helpers/isIgnoredKeybind";
import distance from "../js/helpers/distance";
import eventbus from "../js/eventbus";
import {ClientChan, NetChan} from "../js/types";
import {useStore} from "../js/store";
import {switchToChannel} from "../js/router";
import Sortable from "sortablejs";

export default defineComponent({
	name: "NetworkList",
	components: {
		JoinChannel,
		NetworkLobby,
		Channel,
		Draggable,
	},
	setup() {
		const store = useStore();
		const searchText = ref("");
		const activeSearchItem = ref<ClientChan | null>();
		// Number of milliseconds a touch has to last to be considered long
		const LONG_TOUCH_DURATION = 500;

		const startDrag = ref<[number, number] | null>();
		const searchInput = ref<HTMLInputElement | null>(null);
		const networklist = ref<HTMLDivElement | null>(null);

		const sidebarWasClosed = ref(false);

		const moveItemInArray = <T>(array: T[], from: number, to: number) => {
			const item = array.splice(from, 1)[0];
			array.splice(to, 0, item);
		};

		const items = computed(() => {
			const newItems: NetChan[] = [];

			for (const network of store.state.networks) {
				for (const channel of network.channels) {
					if (
						store.state.activeChannel &&
						channel === store.state.activeChannel.channel
					) {
						continue;
					}

					newItems.push({network, channel});
				}
			}

			return newItems;
		});

		const results = computed(() => {
			const newResults = fuzzyFilter(searchText.value, items.value, {
				extract: (item) => item.channel.name,
			}).map((item) => item.original);

			return newResults;
		});

		const collapseNetwork = (event: Mousetrap.ExtendedKeyboardEvent) => {
			if (isIgnoredKeybind(event)) {
				return true;
			}

			if (store.state.activeChannel) {
				collapseNetworkHelper(store.state.activeChannel.network, true);
			}

			return false;
		};

		const expandNetwork = (event: Mousetrap.ExtendedKeyboardEvent) => {
			if (isIgnoredKeybind(event)) {
				return true;
			}

			if (store.state.activeChannel) {
				collapseNetworkHelper(store.state.activeChannel.network, false);
			}

			return false;
		};

		const onNetworkSort = (e: Sortable.SortableEvent) => {
			const {oldIndex, newIndex} = e;

			if (oldIndex === undefined || newIndex === undefined || oldIndex === newIndex) {
				return;
			}

			moveItemInArray(store.state.networks, oldIndex, newIndex);

			socket.emit("sort", {
				type: "networks",
				order: store.state.networks.map((n) => n.uuid),
			});
		};

		const onChannelSort = (e: Sortable.SortableEvent) => {
			let {oldIndex, newIndex} = e;

			if (oldIndex === undefined || newIndex === undefined || oldIndex === newIndex) {
				return;
			}

			// Indexes are offset by one due to the lobby
			oldIndex += 1;
			newIndex += 1;

			const unparsedId = e.item.getAttribute("data-item");

			if (!unparsedId) {
				return;
			}

			const id = parseInt(unparsedId);
			const netChan = store.getters.findChannel(id);

			if (!netChan) {
				return;
			}

			moveItemInArray(netChan.network.channels, oldIndex, newIndex);

			socket.emit("sort", {
				type: "channels",
				target: netChan.network.uuid,
				order: netChan.network.channels.map((c) => c.id),
			});
		};

		const isTouchEvent = (event: any): boolean => {
			// This is the same way Sortable.js detects a touch event. See
			// SortableJS/Sortable@daaefeda:/src/Sortable.js#L465

			return !!(
				(event.touches && event.touches[0]) ||
				(event.pointerType && event.pointerType === "touch")
			);
		};

		const onDraggableChoose = (event: any) => {
			const original = event.originalEvent;

			if (isTouchEvent(original)) {
				// onDrag is only triggered when the user actually moves the
				// dragged object but onChoose is triggered as soon as the
				// item is eligible for dragging. This gives us an opportunity
				// to tell the user they've held the touch long enough.
				event.item.classList.add("ui-sortable-dragging-touch-cue");

				if (original instanceof TouchEvent && original.touches.length > 0) {
					startDrag.value = [original.touches[0].clientX, original.touches[0].clientY];
				} else if (original instanceof PointerEvent) {
					startDrag.value = [original.clientX, original.clientY];
				}
			}
		};

		const onDraggableUnchoose = (event: any) => {
			event.item.classList.remove("ui-sortable-dragging-touch-cue");
			startDrag.value = null;
		};

		const onDraggableTouchStart = (event: TouchEvent) => {
			if (event.touches.length === 1) {
				// This prevents an iOS long touch default behavior: selecting
				// the nearest selectable text.
				document.body.classList.add("force-no-select");
			}
		};

		const onDraggableTouchMove = (event: TouchEvent) => {
			if (startDrag.value && event.touches.length > 0) {
				const touch = event.touches[0];
				const currentPosition = [touch.clientX, touch.clientY];

				if (distance(startDrag.value, currentPosition as [number, number]) > 10) {
					// Context menu is shown on Android after long touch.
					// Dismiss it now that we're sure the user is dragging.
					eventbus.emit("contextmenu:cancel");
				}
			}
		};

		const onDraggableTouchEnd = (event: TouchEvent) => {
			if (event.touches.length === 0) {
				document.body.classList.remove("force-no-select");
			}
		};

		const activateSearch = () => {
			if (searchInput.value === document.activeElement) {
				return;
			}

			sidebarWasClosed.value = store.state.sidebarOpen ? false : true;
			store.commit("sidebarOpen", true);

			void nextTick(() => {
				searchInput.value?.focus();
			});
		};

		const deactivateSearch = () => {
			activeSearchItem.value = null;
			searchText.value = "";
			searchInput.value?.blur();

			if (sidebarWasClosed.value) {
				store.commit("sidebarOpen", false);
			}
		};

		const toggleSearch = (event: Mousetrap.ExtendedKeyboardEvent) => {
			if (isIgnoredKeybind(event)) {
				return true;
			}

			if (searchInput.value === document.activeElement) {
				deactivateSearch();
				return false;
			}

			activateSearch();
			return false;
		};

		const setSearchText = (e: Event) => {
			searchText.value = (e.target as HTMLInputElement).value;
		};

		const setActiveSearchItem = (channel?: ClientChan) => {
			if (!results.value.length) {
				return;
			}

			if (!channel) {
				channel = results.value[0].channel;
			}

			activeSearchItem.value = channel;
		};

		const scrollToActive = () => {
			// Scroll the list if needed after the active class is applied
			void nextTick(() => {
				const el = networklist.value?.querySelector(".channel-list-item.active");

				if (el) {
					el.scrollIntoView({block: "nearest", inline: "nearest"});
				}
			});
		};

		const selectResult = () => {
			if (!searchText.value || !results.value.length) {
				return;
			}

			if (activeSearchItem.value) {
				switchToChannel(activeSearchItem.value);
				deactivateSearch();
				scrollToActive();
			}
		};

		const navigateResults = (event: Event, direction: number) => {
			// Prevent propagation to stop global keybind handler from capturing pagedown/pageup
			// and redirecting it to the message list container for scrolling
			event.stopImmediatePropagation();
			event.preventDefault();

			if (!searchText.value) {
				return;
			}

			const channels = results.value.map((r) => r.channel);

			// Bail out if there's no channels to select
			if (!channels.length) {
				activeSearchItem.value = null;
				return;
			}

			let currentIndex = activeSearchItem.value
				? channels.indexOf(activeSearchItem.value)
				: -1;

			// If there's no active channel select the first or last one depending on direction
			if (!activeSearchItem.value || currentIndex === -1) {
				activeSearchItem.value = direction ? channels[0] : channels[channels.length - 1];
				scrollToActive();
				return;
			}

			currentIndex += direction;

			// Wrap around the list if necessary. Normaly each loop iterates once at most,
			// but might iterate more often if pgup or pgdown are used in a very short list
			while (currentIndex < 0) {
				currentIndex += channels.length;
			}

			while (currentIndex > channels.length - 1) {
				currentIndex -= channels.length;
			}

			activeSearchItem.value = channels[currentIndex];
			scrollToActive();
		};

		watch(searchText, () => {
			setActiveSearchItem();
		});

		onMounted(() => {
			Mousetrap.bind("alt+shift+right", expandNetwork);
			Mousetrap.bind("alt+shift+left", collapseNetwork);
			Mousetrap.bind("alt+j", toggleSearch);
		});

		onBeforeUnmount(() => {
			Mousetrap.unbind("alt+shift+right");
			Mousetrap.unbind("alt+shift+left");
			Mousetrap.unbind("alt+j");
		});

		const networkContainerRef = ref<HTMLDivElement>();
		const channelRefs = ref<{[key: string]: HTMLDivElement}>({});

		return {
			store,
			networklist,
			searchInput,
			searchText,
			results,
			activeSearchItem,
			LONG_TOUCH_DURATION,

			activateSearch,
			deactivateSearch,
			toggleSearch,
			setSearchText,
			setActiveSearchItem,
			scrollToActive,
			selectResult,
			navigateResults,
			onChannelSort,
			onNetworkSort,
			onDraggableTouchStart,
			onDraggableTouchMove,
			onDraggableTouchEnd,
			onDraggableChoose,
			onDraggableUnchoose,
		};
	},
});
</script>
