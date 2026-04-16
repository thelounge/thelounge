<template>
	<div class="typing-indicator">
		<template v-if="typingText">
			<span class="typing-dots"><span /><span /><span /></span>
			{{ typingText }}
		</template>
	</div>
</template>

<style>
.typing-indicator {
	flex: 0 0 auto;
	padding: 0 10px 4px 11px;
	font-size: 0.65em;
	line-height: 1.2;
	min-height: calc(1.2em + 4px);
	color: var(--body-color-muted);
	display: flex;
	align-items: center;
	gap: 4px;
}

.typing-dots {
	display: inline-flex;
	gap: 2px;
	align-items: center;

	span {
		width: 3px;
		height: 3px;
		border-radius: 50%;
		background: var(--body-color-muted);
		animation: typing-bounce 1.4s infinite ease-in-out both;
	}

	/* Stagger the dots animation */
	span:nth-child(1) {
		animation-delay: -0.32s;
	}

	span:nth-child(2) {
		animation-delay: -0.16s;
	}
}

@keyframes typing-bounce {
	0%,
	80%,
	100% {
		transform: scale(0.6);
		opacity: 0.4;
	}

	40% {
		transform: scale(1);
		opacity: 1;
	}
}
</style>

<script lang="ts">
import {computed, defineComponent, PropType} from "vue";
import type {ClientChan} from "../js/types";
import {useStore} from "../js/store";

export default defineComponent({
	name: "TypingIndicator",
	props: {
		channel: {type: Object as PropType<ClientChan>, required: true},
	},
	setup(props) {
		const store = useStore();

		const typingText = computed(() => {
			if (store.state.settings.typing === "off") {
				return "";
			}

			const nicks = props.channel.typingNicks;

			if (nicks.length === 0) {
				return "";
			}

			if (nicks.length === 1) {
				return `${nicks[0]} is typing...`;
			}

			if (nicks.length === 2) {
				return `${nicks[0]} and ${nicks[1]} are typing...`;
			}

			return `${nicks[0]} and ${nicks.length - 1} others are typing...`;
		});

		return {typingText};
	},
});
</script>
