<template>
	<component
		:is="componentType"
		:type="type"
		:disabled="disabled"
		:class="['btn', classes]"
		:small="small"
		v-on="$listeners"
	>
		<slot />
	</component>
</template>
<style scoped>
.btn {
	border: 2px solid var(--button-color);
	border-radius: 3px;
	color: var(--button-color);
	display: inline-block;
	font-size: 12px;
	font-weight: bold;
	letter-spacing: 1px;
	margin-bottom: 10px;
	padding: 9px 17px;
	text-transform: uppercase;
	transition: background 0.2s, border-color 0.2s, color 0.2s, box-shadow 0.2s;
	word-spacing: 3px;
	cursor: pointer; /* This is useful for `<button>` elements */
}

.btn-cancel {
	border-color: var(--body-color-muted);
}

.btn-danger {
	border-color: red;
}

.btn:disabled,
.btn:hover,
.btn:focus {
	background: var(--button-color);
	color: var(--button-text-color-hover);
	opacity: 1;
}

.btn:active,
.btn:focus {
	outline: 0;
	box-shadow: 0 0 0 3px rgb(132 206 136 / 50%);
}

.btn:active {
	opacity: 0.8;
}

.btn:disabled {
	opacity: 0.6;
}

.btn-small {
	padding: 4px 8px;
	border-width: 1px;
	letter-spacing: 0;
	word-spacing: 0;
	text-transform: none;
}
</style>

<script>
export default {
	name: "StyledButton",
	props: {
		componentType: {
			type: String,
			default: "button",
		},
		text: {
			type: String,
			default: "",
		},
		small: {
			type: Boolean,
			default: false,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		type: {
			type: String,
			default: "submit",
		},
	},
	computed: {
		classes() {
			return {
				"btn-small": this.small,
				"btn-cancel": this.type === "cancel",
				"btn-danger": this.type === "danger",
			};
		},
	},
};
</script>
