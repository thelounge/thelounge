<template>
	<span
		:class="['user', $options.filters.colorClass(user.nick), active ? 'active' : '']"
		:data-name="user.nick"
		role="button">{{ user.mode }}{{ user.nick }}
		@mouseover="hover"
	></span>
</template>

<script>
export default {
	name: "Username",
	props: {
		user: Object,
		active: Boolean,
		onHover: Function,
	},
	methods: {
		hover() {
			this.onHover ? this.onHover(this.user) : null;
		},
	},
};
</script>
