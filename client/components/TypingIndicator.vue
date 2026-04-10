<template>
	<div v-if="typingText" class="typing-indicator" :style="indicatorStyle">
		<span class="typing-dots"><span /><span /><span /></span>
		{{ typingText }}
	</div>
</template>

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
			if (!store.state.settings.typing) {
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

		const indicatorStyle = computed(() => {
			if (window.innerWidth <= 768) {
				return {};
			}

			const settings = store.state.settings;
			let timeWidth = 55;

			if (settings.showSeconds && settings.use12hClock) {
				timeWidth = 90;
			} else if (settings.showSeconds || settings.use12hClock) {
				timeWidth = 75;
			}

			// .time padding-left + width + .from padding-left + width + padding-right + .content border-left + padding-left
			const offset = 10 + timeWidth + 10 + 134 + 10 + 1 + 10;

			return {"padding-left": `${offset}px`};
		});

		return {typingText, indicatorStyle};
	},
});
</script>

<style>
.typing-indicator {
	padding: 2px 10px;
	font-size: 0.85em;
	color: var(--body-color-muted);
	min-height: 1.4em;
	display: flex;
	align-items: center;
	gap: 4px;
}

.typing-dots {
	display: inline-flex;
	gap: 2px;
	align-items: center;
}

.typing-dots span {
	width: 4px;
	height: 4px;
	border-radius: 50%;
	background: var(--body-color-muted);
	animation: typing-bounce 1.4s infinite ease-in-out both;
}

.typing-dots span:nth-child(1) {
	animation-delay: -0.32s;
}

.typing-dots span:nth-child(2) {
	animation-delay: -0.16s;
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
