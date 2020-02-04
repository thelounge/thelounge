<template>
	<span class="content">
		<ParsedMessage :network="network" :message="message" :text="errorMessage" />
	</span>
</template>

<script>
import ParsedMessage from "../ParsedMessage.vue";

export default {
	name: "MessageTypeError",
	components: {
		ParsedMessage,
	},
	props: {
		network: Object,
		message: Object,
	},
	computed: {
		errorMessage() {
			switch (this.message.error) {
				case "bad_channel_key":
					return `Cannot join ${this.message.channel} - Bad channel key.`;
				case "banned_from_channel":
					return `Cannot join ${this.message.channel} - You have been banned from the channel.`;
				case "cannot_send_to_channel":
					return `Cannot send to channel ${this.message.channel}`;
				case "channel_is_full":
					return `Cannot join ${this.message.channel} - Channel is full.`;
				case "chanop_privs_needed":
					return "Cannot perform action: You're not a channel operator.";
				case "invite_only_channel":
					return `Cannot join ${this.message.channel} - Channel is invite only.`;
				case "no_such_nick":
					return `User ${this.message.nick} hasn't logged in or does not exist.`;
				case "not_on_channel":
					return "Cannot perform action: You're not on the channel.";
				case "password_mismatch":
					return "Password mismatch.";
				case "too_many_channels":
					return `Cannot join ${this.message.channel} - You've already reached the maximum number of channels allowed.`;
				case "unknown_command":
					return `Unknown command: ${this.message.command}`;
				case "user_not_in_channel":
					return `User ${this.message.nick} is not on the channel.`;
				case "user_on_channel":
					return `User ${this.message.nick} is already on the channel.`;
				default:
					if (this.message.reason) {
						return `${this.message.reason} (${this.message.error})`;
					}

					return this.message.error;
			}
		},
	},
};
</script>
