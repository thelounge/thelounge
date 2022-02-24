<template>
	<div :aria-label="localeDate" class="date-marker-container tooltipped tooltipped-s">
		<div class="date-marker">
			<span :aria-label="friendlyDate()" class="date-marker-text" />
		</div>
	</div>
</template>

<style scoped>
.date-marker {
	position: relative;
	text-align: center;
	margin: 0 10px;
	z-index: 0;
	font-weight: bold;
	font-size: 12px;
}

.date-marker::before {
	position: absolute;
	z-index: -1;
	content: "";
	left: 0;
	right: 0;
	top: 50%;
	border-top: 1px solid var(--date-marker-color);
}

.date-marker-text::before {
	content: attr(aria-label);
	background-color: var(--window-bg-color);
	color: var(--date-marker-color);
	padding: 0 10px;
}
</style>

<script>
import dayjs from "dayjs";
import calendar from "dayjs/plugin/calendar";
import eventbus from "../js/eventbus";

dayjs.extend(calendar);

export default {
	name: "DateMarker",
	props: {
		message: Object,
		focused: Boolean,
	},
	computed: {
		localeDate() {
			return dayjs(this.message.time).format("D MMMM YYYY");
		},
	},
	mounted() {
		if (this.hoursPassed() < 48) {
			eventbus.on("daychange", this.dayChange);
		}
	},
	beforeDestroy() {
		eventbus.off("daychange", this.dayChange);
	},
	methods: {
		hoursPassed() {
			return (Date.now() - Date.parse(this.message.time)) / 3600000;
		},
		dayChange() {
			this.$forceUpdate();

			if (this.hoursPassed() >= 48) {
				eventbus.off("daychange", this.dayChange);
			}
		},
		friendlyDate() {
			// See http://momentjs.com/docs/#/displaying/calendar-time/
			return dayjs(this.message.time).calendar(null, {
				sameDay: "[Today]",
				lastDay: "[Yesterday]",
				lastWeek: "D MMMM YYYY",
				sameElse: "D MMMM YYYY",
			});
		},
	},
};
</script>
