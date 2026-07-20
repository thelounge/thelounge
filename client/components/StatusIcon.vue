<template>
	<div
		:class="['status-icon', 'tooltipped tooltipped-no-touch', tooltipDirClass]"
		:data-tooltip="label"
		role="img"
		:aria-label="label"
	>
		<span :class="statusClass" />
	</div>
</template>

<style>
.status-icon {
	width: 16px;
	height: 16px;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	margin-left: 4px;
	z-index: 0;
}

.status-icon > span::after {
	content: "";
	width: 8px;
	height: 8px;
	border-radius: 50%;
	display: inline-block;
}

.status-icon > .status-online::after {
	background-color: #2ecc40;
}

.status-icon > .status-offline::after {
	background-color: #ff4136;
}

.status-icon > .status-away::after {
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

		const label = computed(() => {
			if (props.away) {
				return "Away";
			} else if (props.online) {
				return "Online";
			}

			return "Offline";
		});

		const statusClass = computed(() => `status-${label.value.toLowerCase()}`);

		return {
			tooltipDirClass,
			statusClass,
			label,
		};
	},
});
</script>
