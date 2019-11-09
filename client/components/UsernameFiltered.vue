<template>
	<span
		:class="['user', nickColor, {active: active}]"
		:data-name="user.original.nick"
		role="button"
		@mouseover="hover"
		@contextmenu.prevent="rightClick($event)"
		v-html="user.original.mode + user.string"
	/>
</template>

<script>
const colorClass = require("../js/helpers/colorClass");

export default {
	name: "UsernameFiltered",
	props: {
		user: Object,
		active: Boolean,
		onHover: Function,
		contextMenuCallback: Function,
	},
	computed: {
		nickColor() {
			return colorClass(this.user.original.nick);
		},
	},
	methods: {
		hover() {
			this.onHover ? this.onHover(this.user.original) : null;
		},
		rightClick($event) {
			if (this.contextMenuCallback) {
				this.contextMenuCallback($event, this.user);
			}
		},
	},
};
</script>
