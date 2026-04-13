<template>
	<span
		v-if="!parentInHistory"
		class="reply-context disabled tooltipped tooltipped-e"
		aria-label="Original message is no longer in scrollback"
	>
		<span class="reply-context-icon" aria-hidden="true" />
		<template v-if="message.replyToNick">
			<span class="reply-context-nick">{{ message.replyToNick }}</span>
			<span v-if="message.replyToText" class="reply-context-text">{{
				message.replyToText
			}}</span>
		</template>
		<span v-else class="reply-context-unknown">In reply to a message</span>
	</span>
	<div
		v-else
		class="reply-context"
		role="button"
		tabindex="0"
		@click="$emit('scroll-to-parent')"
		@keydown.enter.prevent="$emit('scroll-to-parent')"
		@keydown.space.prevent="$emit('scroll-to-parent')"
	>
		<span class="reply-context-icon" aria-hidden="true" />
		<template v-if="message.replyToNick">
			<span class="reply-context-nick">{{ message.replyToNick }}</span>
			<span v-if="message.replyToText" class="reply-context-text">{{
				message.replyToText
			}}</span>
		</template>
		<span v-else class="reply-context-unknown">In reply to a message</span>
	</div>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import type {ClientMessage} from "../js/types";

export default defineComponent({
	name: "ReplyContext",
	props: {
		message: {type: Object as PropType<ClientMessage>, required: true},
		parentInHistory: {type: Boolean, required: true},
	},
	emits: ["scroll-to-parent"],
});
</script>
