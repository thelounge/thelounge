<template>
	<div
		:id="id"
		ref="rootEl"
		class="emoji-picker"
		:class="{'emoji-picker-flipped': flipped}"
		role="dialog"
		aria-label="Pick a reaction"
		@keydown.tab="onTrapTab"
	>
		<input
			ref="searchEl"
			v-model="query"
			type="search"
			class="emoji-picker-search"
			placeholder="Search emoji…"
			aria-label="Search emoji"
			autocomplete="off"
			@keydown="onSearchKeydown"
		/>

		<template v-if="!query">
			<template v-if="recents.length">
				<div :id="`${id}-recents-h`" class="emoji-picker-section-title">Recent</div>
				<div
					class="emoji-picker-grid"
					role="grid"
					:aria-labelledby="`${id}-recents-h`"
				>
					<button
						v-for="(emoji, idx) in recents"
						:key="`r-${emoji}`"
						type="button"
						role="gridcell"
						class="emoji-picker-btn"
						:tabindex="idx === 0 ? 0 : -1"
						:aria-label="`React with ${emoji}`"
						@click.stop="onPick(emoji)"
						@keydown="onGridKeydown($event, idx)"
					>
						{{ emoji }}
					</button>
				</div>
			</template>

			<div :id="`${id}-quick-h`" class="emoji-picker-section-title">Frequently used</div>
			<div class="emoji-picker-grid" role="grid" :aria-labelledby="`${id}-quick-h`">
				<button
					v-for="(emoji, idx) in QUICK_EMOJI"
					:key="`q-${emoji}`"
					type="button"
					role="gridcell"
					class="emoji-picker-btn"
					:tabindex="recents.length === 0 && idx === 0 ? 0 : -1"
					:aria-label="`React with ${emoji}`"
					@click.stop="onPick(emoji)"
					@keydown="onGridKeydown($event, recents.length + idx)"
				>
					{{ emoji }}
				</button>
			</div>
		</template>

		<template v-else>
			<div
				v-if="results.length"
				class="emoji-picker-grid"
				role="grid"
				aria-label="Search results"
			>
				<button
					v-for="(item, idx) in results"
					:key="`s-${item.name}`"
					type="button"
					role="gridcell"
					class="emoji-picker-btn"
					:tabindex="idx === 0 ? 0 : -1"
					:aria-label="`React with ${item.emoji}, ${item.name}`"
					@click.stop="onPick(item.emoji)"
					@keydown="onGridKeydown($event, idx)"
				>
					{{ item.emoji }}
				</button>
			</div>
			<div v-else class="emoji-picker-empty" role="status">No matches.</div>
		</template>
	</div>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, ref} from "vue";
import fuzzy from "fuzzy";

import emojiMap from "../js/helpers/simplemap.json";
import {getRecents, pushRecent} from "../js/helpers/emojiRecents";

// Curated quick reactions shown when search is empty and recents are exhausted.
// One row of five — most common reactions; everything else lives behind search.
const QUICK_EMOJI = ["👍", "👎", "🙏", "🎉", "✅"];

const COLS = 5;
const MAX_SEARCH_RESULTS = 30;

const EMOJI_NAMES: string[] = Object.keys(emojiMap);

export default defineComponent({
	name: "EmojiPicker",
	props: {
		id: {type: String, required: true},
	},
	emits: ["pick"],
	setup(_, {emit}) {
		const rootEl = ref<HTMLDivElement | null>(null);
		const searchEl = ref<HTMLInputElement | null>(null);
		const query = ref("");
		const recents = ref<string[]>(getRecents());
		const flipped = ref(false);

		// Query DOM for current buttons so we never operate on stale refs
		// that survived a v-if swap (recents/quick → search results).
		const getButtons = (): HTMLButtonElement[] => {
			const root = rootEl.value;

			if (!root) {
				return [];
			}

			return Array.from(root.querySelectorAll<HTMLButtonElement>(".emoji-picker-btn"));
		};

		const results = computed(() => {
			const term = query.value.trim().toLowerCase();

			if (!term) {
				return [];
			}

			const matches = fuzzy
				.filter(term, EMOJI_NAMES)
				.slice(0, MAX_SEARCH_RESULTS)
				.map((m) => ({
					name: m.original,
					emoji: (emojiMap as Record<string, string>)[m.original],
				}));

			// Dedupe by emoji native value (e.g. `+1` and `thumbsup` both map to 👍)
			const seen = new Set<string>();
			return matches.filter((item) => {
				if (seen.has(item.emoji)) {
					return false;
				}

				seen.add(item.emoji);
				return true;
			});
		});

		onMounted(() => {
			// Decide direction off the toolbar (the picker's parent), not the
			// picker itself. Toolbar position is stable and doesn't depend on
			// the picker's own rendering timing or any focus-triggered scroll.
			//
			// If the room below the toolbar is less than the picker's likely
			// height, and there's more room above, flip up.
			const toolbar = rootEl.value?.parentElement;
			const toolbarRect = toolbar?.getBoundingClientRect();
			const pickerRect = rootEl.value?.getBoundingClientRect();
			const pickerHeight = pickerRect?.height || 280;

			if (toolbarRect) {
				const spaceBelow = window.innerHeight - toolbarRect.bottom;
				const spaceAbove = toolbarRect.top;

				if (spaceBelow < pickerHeight + 8 && spaceAbove > spaceBelow) {
					flipped.value = true;
				}
			}

			searchEl.value?.focus({preventScroll: true});
		});

		const onPick = (emoji: string) => {
			recents.value = pushRecent(emoji);
			emit("pick", emoji);
		};

		const focusBtn = (idx: number) => {
			const buttons = getButtons();
			const clamped = Math.max(0, Math.min(idx, buttons.length - 1));
			buttons[clamped]?.focus();
		};

		// Roving tabindex with arrow-key navigation across the visible grid(s).
		const onGridKeydown = (e: KeyboardEvent, idx: number) => {
			const total = getButtons().length;
			let next = idx;

			switch (e.key) {
				case "ArrowRight":
					next = (idx + 1) % total;
					break;
				case "ArrowLeft":
					next = (idx - 1 + total) % total;
					break;
				case "ArrowDown":
					next = idx + COLS < total ? idx + COLS : idx;
					break;
				case "ArrowUp":
					if (idx - COLS >= 0) {
						next = idx - COLS;
					} else {
						searchEl.value?.focus();
						e.preventDefault();
						return;
					}

					break;
				case "Home":
					next = 0;
					break;
				case "End":
					next = total - 1;
					break;
				default:
					return;
			}

			e.preventDefault();
			focusBtn(next);
		};

		const onSearchKeydown = (e: KeyboardEvent) => {
			if (e.key === "ArrowDown") {
				e.preventDefault();
				focusBtn(0);
			} else if (e.key === "Enter") {
				const first = results.value[0];

				if (first) {
					e.preventDefault();
					onPick(first.emoji);
				}
			}
		};

		// Tab focus trap. Without this, Tab from the search input would skip
		// past the buttons (which use roving tabindex) and land on whatever's
		// behind the picker. We intercept Tab and walk through the search +
		// every button manually, wrapping at the ends.
		const onTrapTab = (e: KeyboardEvent) => {
			if (!rootEl.value) {
				return;
			}

			const focusables: HTMLElement[] = [];

			if (searchEl.value) {
				focusables.push(searchEl.value);
			}

			focusables.push(...getButtons());

			const active = document.activeElement as HTMLElement | null;
			const idx = active ? focusables.indexOf(active) : -1;

			if (idx === -1) {
				return;
			}

			const total = focusables.length;
			const next = e.shiftKey ? (idx - 1 + total) % total : (idx + 1) % total;

			e.preventDefault();
			focusables[next]?.focus();
		};

		return {
			rootEl,
			searchEl,
			query,
			recents,
			results,
			flipped,
			QUICK_EMOJI,
			onPick,
			onGridKeydown,
			onSearchKeydown,
			onTrapTab,
		};
	},
});
</script>
