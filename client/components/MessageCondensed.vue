<template>
	<div :class="['msg', {closed: isCollapsed}]" data-type="condensed">
		<div class="condensed-summary">
			<span class="time" />
			<span class="from" />
			<span class="content" @click="onCollapseClick"
				>{{ condensedText
				}}<button class="toggle-button" aria-label="Toggle status messages"
			/></span>
		</div>
		<Message
			v-for="message in messages"
			:key="message.id"
			:network="network"
			:message="message"
		/>
	</div>
</template>

<script lang="ts">
import {computed, defineComponent, PropType, ref} from "vue";
import {condensedTypes} from "../../shared/irc";
import {ClientMessage, ClientNetwork} from "../js/types";
import Message from "./Message.vue";

export default defineComponent({
	name: "MessageCondensed",
	components: {
		Message,
	},
	props: {
		network: {type: Object as PropType<ClientNetwork>, required: true},
		messages: {
			type: Array as PropType<ClientMessage[]>,
			required: true,
		},
		keepScrollPosition: {
			type: Function as PropType<() => void>,
			required: true,
		},
		focused: Boolean,
	},
	setup(props) {
		const isCollapsed = ref(true);

		const onCollapseClick = () => {
			isCollapsed.value = !isCollapsed.value;
			props.keepScrollPosition();
		};

		const condensedText = computed(() => {
			const obj: Record<string, number> = {};

			condensedTypes.forEach((type) => {
				obj[type] = 0;
			});

			for (const message of props.messages) {
				// special case since one MODE message can change multiple modes
				if (message.type === "mode") {
					// syntax: +vv-t maybe-some targets
					// we want the number of mode changes in the message, so count the
					// number of chars other than + and - before the first space
					const modeChangesCount = message.text
						.split(" ")[0]
						.split("")
						.filter((char) => char !== "+" && char !== "-").length;
					obj[message.type] += modeChangesCount;
				} else {
					obj[message.type]++;
				}
			}

			// Count quits as parts in condensed messages to reduce information density
			obj.part += obj.quit;

			const strings: string[] = [];
			condensedTypes.forEach((type) => {
				if (obj[type]) {
					switch (type) {
						case "chghost":
							strings.push(
								String(obj[type]) +
									(obj[type] > 1
										? " users have changed hostname"
										: " user has changed hostname")
							);
							break;
						case "join":
							strings.push(
								String(obj[type]) +
									(obj[type] > 1 ? " users have joined" : " user has joined")
							);
							break;
						case "part":
							strings.push(
								String(obj[type]) +
									(obj[type] > 1 ? " users have left" : " user has left")
							);
							break;
						case "nick":
							strings.push(
								String(obj[type]) +
									(obj[type] > 1
										? " users have changed nick"
										: " user has changed nick")
							);
							break;
						case "kick":
							strings.push(
								String(obj[type]) +
									(obj[type] > 1 ? " users were kicked" : " user was kicked")
							);
							break;
						case "mode":
							strings.push(
								String(obj[type]) +
									(obj[type] > 1 ? " modes were set" : " mode was set")
							);
							break;
						case "away":
							strings.push(
								"marked away " +
									(obj[type] > 1 ? String(obj[type]) + " times" : "once")
							);
							break;
						case "back":
							strings.push(
								"marked back " +
									(obj[type] > 1 ? String(obj[type]) + " times" : "once")
							);
							break;
					}
				}
			});

			if (strings.length) {
				let text = strings.pop();

				if (strings.length) {
					text = strings.join(", ") + ", and " + text!;
				}

				return text;
			}

			return "";
		});

		return {
			isCollapsed,
			condensedText,
			onCollapseClick,
		};
	},
});
</script>
