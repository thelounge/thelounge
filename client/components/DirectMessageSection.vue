<template>
	<div v-if="queries.length > 0" class="dm-section" :class="{ collapsed: isCollapsed }">
		<div class="dm-section-header" @click.stop="toggleCollapsed">
			<span class="dm-collapse-icon" :class="{ 'is-collapsed': isCollapsed }"></span>
			<span class="dm-section-title">Direct Messages</span>
			<span class="dm-count">({{ queries.length }})</span>
			<span v-if="totalUnread > 0" class="dm-unread-badge">{{ totalUnread }}</span>
		</div>

		<template v-if="!isCollapsed">
			<div v-if="queries.length > 2" class="dm-filter">
				<input
					ref="filterInput"
					v-model="filterText"
					type="text"
					placeholder="Filter DMs..."
					class="dm-filter-input"
				/>
			</div>

			<Draggable
				:list="sortedQueries"
				:delay="500"
				:delay-on-touch-only="true"
				:touch-start-threshold="10"
				draggable=".dm-channel-wrapper"
				ghost-class="ui-sortable-ghost"
				drag-class="ui-sortable-dragging"
				:group="network.uuid + '-dms'"
				class="dm-list"
				item-key="id"
				@change="onDMSort"
			>
				<template v-slot:item="{ element: channel }">
					<div
						v-if="shouldShowChannel(channel)"
						class="dm-channel-wrapper"
						:class="{ 'is-pinned': channel.pinned }"
					>
						<Channel
							:key="channel.id"
							:data-item="channel.id"
							:channel="channel"
							:network="network"
							:active="store.state.activeChannel && channel === store.state.activeChannel.channel"
						/>
						<span v-if="channel.pinned" class="pin-indicator" title="Pinned"></span>
					</div>
				</template>
			</Draggable>

			<div
				v-if="hasHiddenChannels"
				class="dm-show-more"
				@click="showAll = !showAll"
			>
				{{ showAll ? 'Show less' : `Show ${hiddenCount} more...` }}
			</div>
		</template>
	</div>
</template>

<style scoped>
.dm-section {
	margin-top: 4px;
}

.dm-section-header {
	display: flex;
	align-items: center;
	padding: 6px 14px;
	cursor: pointer;
	color: rgba(255, 255, 255, 0.7);
	font-size: 0.85em;
	text-transform: uppercase;
	letter-spacing: 0.5px;
	user-select: none;
}

.dm-section-header:hover {
	color: rgba(255, 255, 255, 0.9);
	background-color: rgba(255, 255, 255, 0.05);
}

.dm-collapse-icon {
	font-family: FontAwesome;
	font-size: 0.8em;
	margin-right: 8px;
	width: 12px;
	opacity: 0.8;
	transition: transform 0.2s ease;
}

.dm-collapse-icon::before {
	content: "\f0d7"; /* caret-down */
}

.dm-collapse-icon.is-collapsed::before {
	content: "\f0da"; /* caret-right */
}

.dm-section-header:hover .dm-collapse-icon {
	opacity: 1;
}

.dm-section-title {
	flex: 1;
}

.dm-count {
	margin-left: 4px;
	opacity: 0.7;
}

.dm-unread-badge {
	background-color: #e74c3c;
	color: white;
	font-size: 0.75em;
	padding: 2px 6px;
	border-radius: 10px;
	margin-left: 8px;
}

.dm-filter {
	padding: 4px 14px 8px;
}

.dm-filter-input {
	width: 100%;
	padding: 6px 10px;
	border: none;
	border-radius: 4px;
	background-color: rgba(255, 255, 255, 0.1);
	color: white;
	font-size: 0.9em;
}

.dm-filter-input::placeholder {
	color: rgba(255, 255, 255, 0.4);
}

.dm-filter-input:focus {
	outline: none;
	background-color: rgba(255, 255, 255, 0.15);
}

.dm-list {
	/* Inherit channel list styling */
}

.dm-show-more {
	padding: 8px 14px;
	color: rgba(255, 255, 255, 0.5);
	font-size: 0.85em;
	cursor: pointer;
	text-align: center;
}

.dm-show-more:hover {
	color: rgba(255, 255, 255, 0.8);
	background-color: rgba(255, 255, 255, 0.05);
}

/* DM channel wrapper for pinned indicator */
.dm-channel-wrapper {
	position: relative;
}

.dm-channel-wrapper.is-pinned :deep(.channel-list-item) {
	padding-right: 45px;
}

/* Pinned indicator */
.pin-indicator {
	position: absolute;
	right: 28px;
	top: 50%;
	transform: translateY(-50%);
	font-family: FontAwesome;
	font-size: 0.75em;
	color: rgba(255, 255, 255, 0.5);
	pointer-events: none;
}

.pin-indicator::before {
	content: "\f08d"; /* Font Awesome thumbtack icon */
}
</style>

<script lang="ts">
import {computed, defineComponent, PropType, ref} from "vue";
import {filter as fuzzyFilter} from "fuzzy";
import Draggable from "./Draggable.vue";
import Channel from "./Channel.vue";
import socket from "../js/socket";
import {ClientChan, ClientNetwork} from "../js/types";
import {useStore} from "../js/store";

export default defineComponent({
	name: "DirectMessageSection",
	components: {
		Draggable,
		Channel,
	},
	props: {
		network: {
			type: Object as PropType<ClientNetwork>,
			required: true,
		},
		queries: {
			type: Array as PropType<ClientChan[]>,
			required: true,
		},
	},
	setup(props) {
		const store = useStore();
		const isCollapsed = ref(false);
		const filterText = ref("");
		const showAll = ref(false);
		const maxVisible = 5;

		// Count of unique conversations with unread messages (not total lines)
		const totalUnread = computed(() => {
			return props.queries.filter((q) => q.unread > 0).length;
		});

		const filteredQueries = computed(() => {
			if (!filterText.value) {
				return props.queries;
			}

			const results = fuzzyFilter(filterText.value, props.queries, {
				extract: (q) => q.name,
			});

			return results.map((r) => r.original);
		});

		const sortedQueries = computed(() => {
			const queries = [...filteredQueries.value];

			// Sort: pinned first, then by unread, then by name
			return queries.sort((a, b) => {
				// Pinned always first
				if (a.pinned && !b.pinned) return -1;
				if (!a.pinned && b.pinned) return 1;

				// Then by unread status
				if (a.unread > 0 && b.unread === 0) return -1;
				if (a.unread === 0 && b.unread > 0) return 1;

				// Then alphabetically
				return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
			});
		});

		const visibleQueries = computed(() => {
			if (showAll.value || filterText.value) {
				return sortedQueries.value;
			}

			// Always show pinned + unread + up to maxVisible
			const pinned = sortedQueries.value.filter((q) => q.pinned);
			const unread = sortedQueries.value.filter((q) => !q.pinned && q.unread > 0);
			const rest = sortedQueries.value.filter((q) => !q.pinned && q.unread === 0);

			const remaining = maxVisible - pinned.length - unread.length;

			if (remaining <= 0) {
				return [...pinned, ...unread];
			}

			return [...pinned, ...unread, ...rest.slice(0, remaining)];
		});

		const hiddenCount = computed(() => {
			return sortedQueries.value.length - visibleQueries.value.length;
		});

		const hasHiddenChannels = computed(() => {
			return hiddenCount.value > 0 && !filterText.value;
		});

		const shouldShowChannel = (channel: ClientChan) => {
			return visibleQueries.value.includes(channel);
		};

		const toggleCollapsed = () => {
			console.log("[DEBUG] toggleCollapsed called, current:", isCollapsed.value, "-> new:", !isCollapsed.value);
			isCollapsed.value = !isCollapsed.value;
		};

		const onDMSort = (e: {oldIndex?: number; newIndex?: number}) => {
			const {oldIndex, newIndex} = e;

			if (oldIndex === undefined || newIndex === undefined || oldIndex === newIndex) {
				return;
			}

			// Emit sort event to server
			socket.emit("sort:channels", {
				network: props.network.uuid,
				order: props.network.channels.map((c) => c.id),
			});
		};

		return {
			store,
			isCollapsed,
			filterText,
			showAll,
			totalUnread,
			sortedQueries,
			hiddenCount,
			hasHiddenChannels,
			shouldShowChannel,
			toggleCollapsed,
			onDMSort,
		};
	},
});
</script>
