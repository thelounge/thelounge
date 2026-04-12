<template>
	<div class="setting-row">
		<label :for="'setting-' + name" class="setting-row-text">
			<div class="setting-row-label">{{ label }}</div>
			<div v-if="description" class="setting-row-description">{{ description }}</div>
		</label>
		<div class="setting-toggle">
			<input
				:id="'setting-' + name"
				:checked="checked"
				:disabled="disabled"
				:name="name"
				type="checkbox"
			/>
			<div class="toggle-track">
				<div class="toggle-thumb" />
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
	name: "SettingToggle",
	props: {
		name: {type: String, required: true},
		label: {type: String, required: true},
		description: {type: String, default: ""},
		checked: {type: Boolean, required: true},
		disabled: {type: Boolean, default: false},
	},
});
</script>
