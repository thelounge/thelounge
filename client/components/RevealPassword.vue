<template>
	<div>
		<slot :isVisible="isVisible" />
		<span
			ref="revealButton"
			type="button"
			:class="[
				'reveal-password tooltipped tooltipped-n tooltipped-no-delay',
				{ 'reveal-password-visible': isVisible },
			]"
			:aria-label="isVisible ? 'Hide password' : 'Show password'"
			@click="onClick">
			<span
				:aria-label="isVisible ? 'Hide password' : 'Show password'" />
		</span>
	</div>
</template>

<script>
export default {
	name: "RevealPassword",
	data() {
		return {
			isVisible: false,
		};
	},
	methods: {
		onClick() {
			this.isVisible = !this.isVisible;
		},
	},
};
</script>
