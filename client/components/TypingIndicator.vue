<template>
	<div v-if="typingText" class="typing-indicator">
		<span class="typing-dots"><span /><span /><span /></span>
		{{ typingText }}
	</div>
</template>

<style>
.chat-input-wrapper {
	position: relative;
}

.typing-indicator {
	position: absolute;
	bottom: 100%;
	left: 0;
	right: 0;
	height: 24px;
	padding: 0 24px;
	font-size: 0.8em;
	color: var(--body-color-muted);
	background: linear-gradient(to top, var(--window-bg-color) 40%, transparent);
	pointer-events: none;
	display: flex;
	align-items: center;
	gap: 4px;
}

/* We align just left of the userlist */
.userlist-open .typing-indicator {
	right: calc(var(--userlist-width) + 1px);
}

.typing-dots {
	display: inline-flex;
	gap: 2px;
	align-items: center;

	span {
		width: 4px;
		height: 4px;
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
