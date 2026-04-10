<template>
	<div
		:class="['status', 'tooltipped tooltipped-no-touch', tooltipDirClass]"
		:aria-label="ariaLabel"
	>
		<span :class="statusClass" />
	</div>
</template>

<style>
.status {
	width: 16px;
	height: 16px;
	display: inline-flex;
	align-items: center;
	justify-content: center;
}

.online::after,
.away::after,
.offline::after {
	content: "";
	width: 8px;
	height: 8px;
	border-radius: 50%;
	display: inline-block;
}

.online::after {
	background-color: #2ecc40;
}

.offline::after {
	background-color: #ff4136;
}

.away::after {
	background-color: gray;
}
</style>

<script lang="ts">
import {computed, PropType, defineComponent} from "vue";

export default defineComponent({
	name: "StatusIcon",
	props: {
		online: Boolean,
		away: Boolean,
		tooltipDir: String as PropType<"n" | "s" | "e" | "w">,
	},
	setup(props) {
		const tooltipDirClass = computed(
			() => `tooltipped-${props.tooltipDir ? props.tooltipDir : "w"}`
		);

		const statusClass = computed(() => {
			if (props.away) {
				return "away";
			} else if (props.online) {
				return "online";
			}

			return "offline";
		});

		const ariaLabel = computed(() => {
			if (props.away) {
				return "Away";
			} else if (props.online) {
				return "Online";
			}

			return "Offline";
		});

		return {
			tooltipDirClass,
			statusClass,
			ariaLabel,
		};
	},
});
</script>
