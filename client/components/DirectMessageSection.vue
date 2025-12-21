<template>
	<div v-if="queries.length > 0" class="dm-section" :class="{ collapsed: isCollapsed }">
		<div class="channel-list-item dm-section-header" :class="hasUnread ? 'has-unread has-highlight': ''" :title="'Total Queries: ' + queries.length + ' - Total Unread: ' + totalUnreadCount" @click.stop="toggleCollapsed">
			<span class="dm-collapse-icon" :class="{ 'is-collapsed': isCollapsed }"></span>
			<span class="dm-section-title">Direct Messages</span>
			<span v-if="hasUnread" class="dm-unread-badge highlight badge">{{ totalUnreadCount }}</span>
		</div>

		<template v-if="!isCollapsed">
			<div v-if="queries.length >= 8" class="dm-filter">
				<input
					ref="filterInput"
					v-model="filterText"
					type="text"
					placeholder="Filter DMs..."
					class="dm-filter-input input"
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
					</div>
				</template>
			</Draggable>

			<div
				v-if="hasHiddenChannels"
				class="channel-list-item dm-show-more"
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
	color: rgba(255, 255, 255, 0.7);
	user-select: none;
}

.dm-collapse-icon {
	font-family: FontAwesome;
	margin: 0 11px 0 2px;
	font-size: initial;
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
	flex-grow: 1;
	margin-right: 5px;
	overflow: hidden;
	position: relative;
	white-space: nowrap;
	font-size: 14px;
	font-weight: 700;
	text-transform: capitalize;
	mask-image: linear-gradient(270deg,#0000,#000 20px);
}

.dm-filter {
	margin: 8px;
	position: relative;

	&::before {
		bottom: 0;
		color: rgba(255, 255, 255, 0.349);
		content: "\f0b0";
		font-family: FontAwesome;
		line-height: 35px !important;
		pointer-events: none;
		position: absolute;
		right: 8px;
		top: 0;
	}
}

.dm-filter-input {
	appearance: none;
	background-color: rgba(255, 255, 255, 0.102);
	border: 0;
	color: rgb(255, 255, 255);
	margin: 0;
	padding-right: 35px;
	width: 100%;
}

.dm-filter-input::placeholder {
	color: rgba(255, 255, 255, 0.35);
}

.dm-filter-input:focus {
	outline: none;
	background-color: rgba(255, 255, 255, 0.15);
}

.dm-list {
	/* Inherit channel list styling */
}

.dm-show-more {
	color: rgba(255, 255, 255, 0.5);
	font-size: 0.85em;
	justify-content: center;
}

/* DM channel wrapper for pinned indicator */
.dm-channel-wrapper {
	position: relative;
}

.dm-channel-wrapper.is-pinned :deep(.channel-list-item) {
	padding: 8px 14px;

	/* Pinned indicator, replace message icon */
	&::before {
		content: "\f08d";
		rotate: 45deg;
		transform: translate(2px, 2px);
	}
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
import roundBadgeNumber from "../js/helpers/roundBadgeNumber";

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
		// Skip muted channels - they shouldn't contribute to the unread badge
		const hasUnread = computed(() => {
			return props.queries.filter((q) => q.unread > 0 && !q.muted).length > 0;
		});
		const totalUnreadCount = computed(() => {
			return roundBadgeNumber(props.queries.filter((q) => q.unread > 0 && !q.muted).length)
		})

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
			hasUnread,
			totalUnreadCount,
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
