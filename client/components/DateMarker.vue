<template>
	<div
		:data-time="message.time"
		:aria-label="message.time | localedate"
		class="date-marker-container tooltipped tooltipped-s">
		<div class="date-marker">
			<span
				:data-label="message.time | friendlydate"
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
		const hoursPassed = moment.duration(moment().diff(moment(this.message.time))).asHours();

		if (hoursPassed < 48) {
			this.$root.$on("daychange", this.dayChange);
		}
	},
	beforeDestroy() {
		this.$root.$off("daychange", this.dayChange);
	},
	methods: {
		dayChange() {
			this.$forceUpdate();
		},
	},
};
</script>
