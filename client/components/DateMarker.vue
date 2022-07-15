<template>
	<div :aria-label="localeDate" class="date-marker-container tooltipped tooltipped-s">
		<div class="date-marker">
			<span :aria-label="friendlyDate()" class="date-marker-text" />
		</div>
	</div>
</template>

<script lang="ts">
import dayjs from "dayjs";
import calendar from "dayjs/plugin/calendar";
import {computed, defineComponent, onBeforeUnmount, onMounted, PropType} from "vue";
import eventbus from "../js/eventbus";
import type {ClientMessage} from "../js/types";

dayjs.extend(calendar);

export default defineComponent({
	name: "DateMarker",
	props: {
		message: {
			type: Object as PropType<ClientMessage>,
			required: true,
		},
		focused: Boolean,
	},
	setup(props) {
		const localeDate = computed(() => dayjs(props.message.time).format("D MMMM YYYY"));

		const hoursPassed = () => {
			return (Date.now() - Date.parse(props.message.time.toString())) / 3600000;
		};

		const dayChange = () => {
			if (hoursPassed() >= 48) {
				eventbus.off("daychange", dayChange);
			}
		};

		const friendlyDate = () => {
			// See http://momentjs.com/docs/#/displaying/calendar-time/
			return dayjs(props.message.time).calendar(null, {
				sameDay: "[Today]",
				lastDay: "[Yesterday]",
				lastWeek: "D MMMM YYYY",
				sameElse: "D MMMM YYYY",
			});
		};

		onMounted(() => {
			if (hoursPassed() < 48) {
				eventbus.on("daychange", dayChange);
			}
		});

		onBeforeUnmount(() => {
			eventbus.off("daychange", dayChange);
		});

		return {
			localeDate,
			friendlyDate,
		};
	},
});
</script>
