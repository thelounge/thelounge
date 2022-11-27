<template>
	<span
		:class="['user', {[nickColor]: store.state.settings.coloredNicks}, {active: active}]"
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
import {UserInMessage} from "../../server/models/msg";
import eventbus from "../js/eventbus";
import colorClass from "../js/helpers/colorClass";
import type {ClientChan, ClientNetwork, ClientUser} from "../js/types";
import {useStore} from "../js/store";

type UsernameUser = Partial<UserInMessage> & {
	mode?: string;
	nick: string;
};

export default defineComponent({
	name: "Username",
	props: {
		user: {
			// TODO: UserInMessage shouldn't be necessary here.
			type: Object as PropType<UsernameUser | UserInMessage>,
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

		// TODO: Nick must be ! because our user prop union includes UserInMessage
		const nickColor = computed(() => colorClass(props.user.nick!));

		const hover = () => {
			if (props.onHover) {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-return
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

		const store = useStore();

		return {
			mode,
			nickColor,
			hover,
			openContextMenu,
			store,
		};
	},
});
</script>
