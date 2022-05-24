<template>
	<span
		:class="['user', nickColor, {active: active}]"
		:data-name="user.nick"
		role="button"
		v-on="onHover ? {mouseenter: hover} : {}"
		@click.prevent="openContextMenu"
		@contextmenu.prevent="openContextMenu"
		><slot>{{ mode }}{{ user.nick }}</slot></span
	>
</template>

<script lang="ts">
import {computed, defineComponent, PropType} from "vue";
import {UserInMessage} from "../../src/models/msg";
import eventbus from "../js/eventbus";
import colorClass from "../js/helpers/colorClass";
import type {ClientChan, ClientNetwork, ClientUser} from "../js/types";

type UsernameUser = Partial<UserInMessage> &
	Partial<{
		nick: string;
		mode: string;
	}>;

export default defineComponent({
	name: "Username",
	props: {
		user: {
			type: Object as PropType<UsernameUser>,
			required: true,
		},
		active: Boolean,
		onHover: {
			type: Function as PropType<(user: UserInMessage) => void>,
			required: false,
		},
		channel: {type: Object as PropType<ClientChan>, required: false},
		network: {type: Object as PropType<ClientNetwork>, required: false},
	},
	setup(props) {
		const mode = computed(() => {
			// Message objects have a singular mode, but user objects have modes array
			if (props.user.modes) {
				return props.user.modes[0];
			}

			return props.user.mode;
		});

		const nickColor = computed(() => colorClass(props.user.nick!));

		const hover = () => {
			if (props.onHover) {
				return props.onHover(props.user as UserInMessage);
			}

			return null;
		};

		const openContextMenu = (event: Event) => {
			eventbus.emit("contextmenu:user", {
				event: event,
				user: props.user,
				network: props.network,
				channel: props.channel,
			});
		};

		return {
			mode,
			nickColor,
			hover,
			openContextMenu,
		};
	},
});
</script>
