<template>
	<span class="content">
		<ParsedMessage :network="network" :message="message" :text="errorMessage" />
	</span>
</template>

<script lang="ts">
import ParsedMessage from "../ParsedMessage.vue";
import {computed, defineComponent, PropType} from "vue";
import {ClientNetwork, ClientMessage} from "../../js/types";

export default defineComponent({
	name: "MessageTypeError",
	components: {
		ParsedMessage,
	},
	props: {
		network: {
			type: Object as PropType<ClientNetwork>,
			required: true,
		},
		message: {
			type: Object as PropType<ClientMessage>,
			required: true,
		},
	},
	setup(props) {
		const errorMessage = computed(() => {
			switch (props.message.error) {
				case "bad_channel_key":
					return `Cannot join ${props.message.channel} - Bad channel key.`;
				case "banned_from_channel":
					return `Cannot join ${props.message.channel} - You have been banned from the channel.`;
				case "cannot_send_to_channel":
					return `Cannot send to channel ${props.message.channel}`;
				case "channel_is_full":
					return `Cannot join ${props.message.channel} - Channel is full.`;
				case "chanop_privs_needed":
					return "Cannot perform action: You're not a channel operator.";
				case "invite_only_channel":
					return `Cannot join ${props.message.channel} - Channel is invite only.`;
				case "no_such_nick":
					return `User ${props.message.nick} hasn't logged in or does not exist.`;
				case "not_on_channel":
					return "Cannot perform action: You're not on the channel.";
				case "password_mismatch":
					return "Password mismatch.";
				case "too_many_channels":
					return `Cannot join ${props.message.channel} - You've already reached the maximum number of channels allowed.`;
				case "unknown_command":
					return `Unknown command: ${props.message.command}`;
				case "user_not_in_channel":
					return `User ${props.message.nick} is not on the channel.`;
				case "user_on_channel":
					return `User ${props.message.nick} is already on the channel.`;
				default:
					if (props.message.reason) {
						return `${props.message.reason} (${props.message.error})`;
					}

					return props.message.error;
			}
		});

		return {
			errorMessage,
		};
	},
});
</script>
