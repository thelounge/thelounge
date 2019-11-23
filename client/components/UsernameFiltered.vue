<template>
	<span
		:class="['user', nickColor, {active: active}]"
		:data-name="user.original.nick"
		role="button"
		@mouseover="onHover(user.original)"
		@click.prevent="openContextMenu"
		@contextmenu.prevent="openContextMenu"
		v-html="user.original.mode + user.string"
	/>
</template>

<script>
import colorClass from "../js/helpers/colorClass";

export default {
	name: "UsernameFiltered",
	props: {
		user: Object,
		active: Boolean,
		onHover: Function,
	},
	computed: {
		nickColor() {
			return colorClass(this.user.original.nick);
		},
	},
	methods: {
		openContextMenu(event) {
			this.$root.$emit("contextmenu:user", {
				event: event,
				user: this.user.original,
			});
		},
	},
};
</script>
