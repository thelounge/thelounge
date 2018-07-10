<template>
	<span
		:class="['user', $options.filters.colorClass(user.original.nick), active ? 'active' : '']"
		:data-name="user.original.nick"
		role="button"
		v-html="user.original.mode + user.string"/>
</template>

<script>
export default {
	name: "UsernameFiltered",
	props: {
		user: Object,
		active: Boolean,
	},
};
</script>
