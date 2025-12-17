<template>
	<span class="content mass-event-summary">
		<strong>Mass event:</strong>
		<span v-for="(item, index) in summaryParts" :key="index">
			{{ index > 0 ? ", " : " " }}{{ item }}
		</span>
		<i class="mass-event-duration"> ({{ formattedDuration }})</i>
	</span>
</template>

<script lang="ts">
import {computed, defineComponent, PropType} from "vue";
import type {ClientMessage, ClientNetwork} from "../../js/types";

export default defineComponent({
	name: "MessageTypeMassEvent",
	props: {
		network: {
			type: Object as PropType<ClientNetwork>,
			required: true,
		},
		message: {
			type: Object as PropType<ClientMessage>,
			required: true,
		},
	},
	setup(props) {
		const summaryParts = computed(() => {
			const parts: string[] = [];
			const summary = props.message.massEventSummary;

			if (!summary) {
				return ["No summary data"];
			}

			if (summary.joins > 0) {
				parts.push(`${summary.joins} user${summary.joins !== 1 ? "s" : ""} joined`);
			}

			if (summary.parts > 0) {
				parts.push(`${summary.parts} user${summary.parts !== 1 ? "s" : ""} left`);
			}

			if (summary.quits > 0) {
				parts.push(`${summary.quits} user${summary.quits !== 1 ? "s" : ""} quit`);
			}

			if (summary.kicks > 0) {
				parts.push(`${summary.kicks} user${summary.kicks !== 1 ? "s" : ""} kicked`);
			}

			if (summary.nicks > 0) {
				parts.push(`${summary.nicks} nick change${summary.nicks !== 1 ? "s" : ""}`);
			}

			if (summary.modes > 0) {
				parts.push(`${summary.modes} mode change${summary.modes !== 1 ? "s" : ""}`);
			}

			if (summary.chghosts > 0) {
				parts.push(`${summary.chghosts} host change${summary.chghosts !== 1 ? "s" : ""}`);
			}

			if (summary.away > 0) {
				parts.push(`${summary.away} user${summary.away !== 1 ? "s" : ""} away`);
			}

			if (summary.back > 0) {
				parts.push(`${summary.back} user${summary.back !== 1 ? "s" : ""} back`);
			}

			return parts.length > 0 ? parts : ["No events"];
		});

		const formattedDuration = computed(() => {
			const summary = props.message.massEventSummary;

			if (!summary || !summary.duration) {
				return "0s";
			}

			const seconds = Math.round(summary.duration / 1000);

			if (seconds < 60) {
				return `${seconds}s`;
			}

			const minutes = Math.floor(seconds / 60);
			const remainingSeconds = seconds % 60;

			if (remainingSeconds === 0) {
				return `${minutes}m`;
			}

			return `${minutes}m ${remainingSeconds}s`;
		});

		return {
			summaryParts,
			formattedDuration,
		};
	},
});
</script>
