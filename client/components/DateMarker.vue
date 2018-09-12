<template>
	<div
		:aria-label="localeDate"
		class="date-marker-container tooltipped tooltipped-s">
		<div class="date-marker">
			<span
				:data-label="friendlyDate()"
				class="date-marker-text" />
		</div>
	</div>
</template>

<script>
const moment = require("moment");

export default {
	name: "DateMarker",
	props: {
		message: Object,
	},
	mounted() {
		if (this.hoursPassed() < 48) {
			this.$root.$on("daychange", this.dayChange);
		}
	},
	beforeDestroy() {
		this.$root.$off("daychange", this.dayChange);
	},
	computed: {
		localeDate() {
			return moment(this.message.time).format("D MMMM YYYY");
		},
	},
	methods: {
		hoursPassed() {
			return moment.duration(moment().diff(moment(this.message.time))).asHours()
		},
		dayChange() {
			this.$forceUpdate();

			if (this.hoursPassed() >= 48) {
				this.$root.$off("daychange", this.dayChange);
			}
		},
		friendlyDate() {
			// See http://momentjs.com/docs/#/displaying/calendar-time/
			return moment(this.message.time).calendar(null, {
				sameDay: "[Today]",
				lastDay: "[Yesterday]",
				lastWeek: "D MMMM YYYY",
				sameElse: "D MMMM YYYY",
			});
		},
	},
};
</script>
