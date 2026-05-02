<template>
	<span v-if="entries.length" class="msg-reactions" role="group" aria-label="Reactions">
		<button
			v-for="entry in entries"
			:key="entry.value"
			type="button"
			class="msg-reaction"
			:class="{'msg-reaction-mine': entry.mine}"
			:aria-pressed="entry.mine"
			:aria-label="entry.label"
			:title="entry.tooltip"
			:disabled="readOnly"
			@click.stop="readOnly ? null : $emit('toggle', entry.value)"
		>
			<span class="msg-reaction-value" aria-hidden="true">{{ entry.value }}</span>
			<span class="msg-reaction-count" aria-hidden="true">{{ entry.nicks.length }}</span>
		</button>
	</span>
</template>

<script lang="ts">
import {computed, defineComponent, PropType} from "vue";

type Reactions = {[reaction: string]: string[]};

export default defineComponent({
	name: "MessageReactions",
	props: {
		reactions: {type: Object as PropType<Reactions>, required: true},
		myNick: {type: String, required: true},
		readOnly: {type: Boolean, default: false},
	},
	emits: ["toggle"],
	setup(props) {
		const entries = computed(() =>
			Object.entries(props.reactions)
				.filter(([, nicks]) => nicks.length > 0)
				.map(([value, nicks]) => {
					const mine = nicks.includes(props.myNick);
					const count = nicks.length;
					const reactors = nicks.join(", ");
					const noun = count === 1 ? "reaction" : "reactions";

					let action = "";
					if (!props.readOnly) {
						action = mine
							? ", click to remove your reaction"
							: ", click to react";
					}

					return {
						value,
						nicks,
						mine,
						tooltip: reactors,
						label: `${value}, ${count} ${noun} (${reactors})${action}`,
					};
				})
		);

		return {entries};
	},
});
</script>
