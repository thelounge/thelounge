<template>
	<span
		:class="['user', nickColor, {active: active}]"
		:data-name="user.nick"
		role="button"
		v-on="onHover ? {mouseover: hover} : {}"
		@contextmenu.prevent="rightClick($event)"
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
		contextMenuCallback: Function,
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
		rightClick($event) {
			if (this.contextMenuCallback) {
				this.contextMenuCallback($event, this.user);
			}
		},
	},
};
</script>
