<template>
	<div class="password-container">
		<span
			ref="revealButton"
			type="button"
			:class="[
				'reveal-password tooltipped tooltipped-n tooltipped-no-delay',
				{'reveal-password-visible': isVisible},
			]"
			:aria-label="isVisible ? 'Hide password' : 'Show password'"
			@click="onClick"
		>
			<span :aria-label="isVisible ? 'Hide password' : 'Show password'" />
		</span>
		<input
			:value="password"
			:type="isVisible ? 'text' : 'password'"
			v-bind="$attrs"
			class="input"
			autocapitalize="none"
			autocorrect="off"
			maxlength="300"
			@input="$emit('update:password', ($event.target as HTMLInputElement).value || '')"
		/>
	</div>
</template>

<style scoped>
.password-container {
	width: 100%; /* we pretty much always want to expand to the full space here, so let's default to that*/
}
</style>

<script lang="ts">
import {defineComponent, ref} from "vue";

export default defineComponent({
	name: "RevealPassword",
	inheritAttrs: false, // we pass those all to the input field
	props: {
		password: String,
	},
	emits: {
		"update:password": String, // this makes v-model:password magically update the reactive container if the input changes
	},
	setup() {
		const isVisible = ref(false);

		const onClick = () => {
			isVisible.value = !isVisible.value;
		};

		return {
			isVisible,
			onClick,
		};
	},
});
</script>
