<template>
	<div :aria-label="localeDate" class="date-marker-container tooltipped tooltipped-s">
		<div class="date-marker">
			<span :data-label="friendlyDate()" class="date-marker-text" />
		</div>
	</div>
</template>

<script>
import dayjs from "dayjs";
import calendar from "dayjs/plugin/calendar";

dayjs.extend(calendar);

export default {
	name: "DateMarker",
	props: {
		message: Object,
	},
	computed: {
		localeDate() {
			return dayjs(this.message.time).format("D MMMM YYYY");
		},
	},
	mounted() {
		if (this.hoursPassed() < 48) {
			this.$root.$on("daychange", this.dayChange);
		}
	},
	beforeDestroy() {
		this.$root.$off("daychange", this.dayChange);
	},
	methods: {
		hoursPassed() {
			return (Date.now() - Date.parse(this.message.time)) / 3600000;
		},
		dayChange() {
			this.$forceUpdate();

			if (this.hoursPassed() >= 48) {
				this.$root.$off("daychange", this.dayChange);
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
