<template>
	<form
		:id="'join-channel-' + channel.id"
		class="join-form"
		method="post"
		action=""
		autocomplete="off"
		@keydown.esc.prevent="$emit('toggle-join-channel')"
		@submit.prevent="onSubmit"
	>
		<input
			v-model="inputChannel"
			v-focus
			type="text"
			class="input"
			name="channel"
			placeholder="Channel"
			pattern="[^\s]+"
			maxlength="200"
			title="The channel name may not contain spaces"
			required
		/>
		<input
			v-model="inputPassword"
			type="password"
			class="input"
			name="key"
			placeholder="Password (optional)"
			pattern="[^\s]+"
			maxlength="200"
			title="The channel password may not contain spaces"
			autocomplete="new-password"
		/>
		<button type="submit" class="btn btn-small">Join</button>
	</form>
</template>

<script lang="ts">
import {defineComponent, PropType, ref} from "vue";
import {switchToChannel} from "../js/router";
import socket from "../js/socket";
import {useStore} from "../js/store";
import {ClientNetwork, ClientChan} from "../js/types";

export default defineComponent({
	name: "JoinChannel",
	directives: {
		focus: {
			mounted: (el: HTMLFormElement) => el.focus(),
		},
	},
	props: {
		network: {type: Object as PropType<ClientNetwork>, required: true},
		channel: {type: Object as PropType<ClientChan>, required: true},
	},
	emits: ["toggle-join-channel"],
	setup(props, {emit}) {
		const store = useStore();
		const inputChannel = ref("");
		const inputPassword = ref("");

		const onSubmit = () => {
			const existingChannel = store.getters.findChannelOnCurrentNetwork(inputChannel.value);

			if (existingChannel) {
				switchToChannel(existingChannel);
			} else {
				const chanTypes = props.network.serverOptions.CHANTYPES;
				let channel = inputChannel.value;

				if (chanTypes && chanTypes.length > 0 && !chanTypes.includes(channel[0])) {
					channel = chanTypes[0] + channel;
				}

				socket.emit("input", {
					text: `/join ${channel} ${inputPassword.value}`,
					target: props.channel.id,
				});
			}

			inputChannel.value = "";
			inputPassword.value = "";
			emit("toggle-join-channel");
		};

		return {
			inputChannel,
			inputPassword,
			onSubmit,
		};
	},
});
</script>
