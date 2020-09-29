<template>
	<span
		:class="['user', nickColor, {active: active}]"
		:data-name="user.nick"
		role="button"
		v-on="onHover ? {mouseenter: hover} : {}"
		@click.prevent="openContextMenu"
		@contextmenu.prevent="openContextMenu"
		><slot>{{ mode }}{{ user.nick }}</slot></span
	>
</template>

<script>
import eventbus from "../js/eventbus";
import colorClass from "../js/helpers/colorClass";

export default {
	name: "Username",
	props: {
		user: Object,
		active: Boolean,
		onHover: Function,
	},
	computed: {
		mode() {
			// Message objects have a singular mode, but user objects have modes array
			if (this.user.modes) {
				return this.user.modes[0];
			}

			return this.user.mode;
		},
		nickColor() {
			return colorClass(this.user.nick);
		},
	},
	methods: {
		hover() {
			return this.onHover(this.user);
		},
		openContextMenu(event) {
			eventbus.emit("contextmenu:user", {
				event: event,
				user: this.user,
			});
		},
	},
};
</script>
