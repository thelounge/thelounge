<template>
	<li :aria-label="name">
		<router-link
			v-slot:default="{navigate, isExactActive}"
			:to="'/settings/' + to"
			:class="['icon', className]"
			:aria-label="name"
			role="tab"
			aria-controls="settings"
			:aria-selected="$route.name === name"
			custom
		>
			<button :class="{active: isExactActive}" @click="navigate" @keypress.enter="navigate">
				{{ name }}
			</button>
		</router-link>
	</li>
</template>

<script>
export default {
	name: "SettingTabListItem",
	props: {
		name: {
			type: String,
			required: true,
		},
		className: {
			type: String,
			required: true,
		},
		to: {
			type: String,
			required: true,
		},
	},
};
</script>
