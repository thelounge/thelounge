<template>
	<span
		:class="['user', $options.filters.colorClass(user.nick), active ? 'active' : '']"
		:data-name="user.nick"
		role="button">{{ user.mode }}{{ user.nick }}</span>
</template>

<script>
export default {
	name: "Username",
	props: {
		user: Object,
		active: Boolean,
	},
};
</script>
