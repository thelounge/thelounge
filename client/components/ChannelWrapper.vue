<template>
	<!-- TODO: move closed style to it's own class -->
	<div
		v-if="isChannelVisible"
		ref="element"
		:class="[
			'channel-list-item',
			{active: active},
			{'parted-channel': channel.type === 'channel' && channel.state === 0},
			{'has-draft': channel.pendingMessage},
			{'has-unread': channel.unread},
			{'has-highlight': channel.highlight},
			{
				'not-secure':
					channel.type === 'lobby' && network.status.connected && !network.status.secure,
			},
			{'not-connected': channel.type === 'lobby' && !network.status.connected},
			{'is-muted': channel.muted},
		]"
		:aria-label="getAriaLabel()"
		:title="getAriaLabel()"
		:data-name="channel.name"
		:data-type="channel.type"
		:aria-controls="'#chan-' + channel.id"
		:aria-selected="active"
		:style="channel.closed ? {transition: 'none', opacity: 0.4} : undefined"
		role="tab"
		@click="click"
		@contextmenu.prevent="openContextMenu"
	>
		<slot :network="network" :channel="channel" :active-channel="activeChannel" />
	</div>
</template>

<script lang="ts">
import eventbus from "../js/eventbus";
import isChannelCollapsed from "../js/helpers/isChannelCollapsed";
import {ClientNetwork, ClientChan} from "../js/types";
import {computed, defineComponent, PropType} from "vue";
import {useStore} from "../js/store";
import {switchToChannel} from "../js/router";

export default defineComponent({
	name: "ChannelWrapper",
	props: {
		network: {
			type: Object as PropType<ClientNetwork>,
			required: true,
		},
		channel: {
			type: Object as PropType<ClientChan>,
			required: true,
		},
		active: Boolean,
		isFiltering: Boolean,
	},
	setup(props) {
		const store = useStore();
		const activeChannel = computed(() => store.state.activeChannel);
		const isChannelVisible = computed(
			() => props.isFiltering || !isChannelCollapsed(props.network, props.channel)
		);

		const getAriaLabel = () => {
			const extra: string[] = [];
			const type = props.channel.type;

			if (props.channel.unread > 0) {
				if (props.channel.unread > 1) {
					extra.push(`${props.channel.unread} unread messages`);
				} else {
					extra.push(`${props.channel.unread} unread message`);
				}
			}

			if (props.channel.highlight > 0) {
				if (props.channel.highlight > 1) {
					extra.push(`${props.channel.highlight} mentions`);
				} else {
					extra.push(`${props.channel.highlight} mention`);
				}
			}

			return `${type}: ${props.channel.name} ${extra.length ? `(${extra.join(", ")})` : ""}`;
		};

		const click = () => {
			if (props.isFiltering) {
				return;
			}

			switchToChannel(props.channel);
		};

		const openContextMenu = (event: MouseEvent) => {
			eventbus.emit("contextmenu:channel", {
				event: event,
				channel: props.channel,
				network: props.network,
			});
		};

		return {
			activeChannel,
			isChannelVisible,
			getAriaLabel,
			click,
			openContextMenu,
		};
	},
});
</script>
