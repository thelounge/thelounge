<template>
	<span
		:class="['user', nickColor, {active: active}]"
		:data-name="user.nick"
		role="button"
		v-on="onHover ? {mouseenter: hover} : {}"
		@click.prevent="openContextMenu"
		@contextmenu.prevent="openContextMenu"
		><slot>{{ user.mode }}{{ user.nick }}</slot></span
	>
</template>

<script>
import colorClass from "../js/helpers/colorClass";

export default {
	name: "Username",
	props: {
		user: Object,
		active: Boolean,
		onHover: Function,
		channel: Object,
		network: Object,
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
		openContextMenu(event) {
			this.$root.$emit("contextmenu:user", {
				event: event,
				user: this.user,
				network: this.network,
				channel: this.channel,
			});
		},
	},
};
</script>
