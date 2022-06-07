<template>
	<li :aria-label="name" role="tab" :aria-selected="route.name === name" aria-controls="settings">
		<router-link v-slot:default="{navigate, isExactActive}" :to="'/settings/' + to" custom>
			<button
				:class="['icon', className, {active: isExactActive}]"
				@click="navigate"
				@keypress.enter="navigate"
			>
				{{ name }}
			</button>
		</router-link>
	</li>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {useRoute} from "vue-router";

export default defineComponent({
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
	setup() {
		const route = useRoute();

		return {
			route,
		};
	},
});
</script>
