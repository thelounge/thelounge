<template>
	<span
		:class="['user', nickColor, {active: active}]"
		:data-name="user.nick"
		role="button"
		v-on="onHover ? {mouseover: hover} : {}"
		>{{ user.mode }}{{ user.nick }}</span
	>
</template>

<script>
const colorClass = require("../js/helpers/colorClass");

export default {
	name: "Username",
	props: {
		user: Object,
		active: Boolean,
		onHover: Function,
	},
	computed: {
		nickColor() {
			return colorClass(this.user.nick);
		},
	},
	methods: {
		hover() {
			return this.onHover(this.user);
		},
	},
};
</script>
