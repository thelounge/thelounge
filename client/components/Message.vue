<template>
	<div
		:id="'msg-' + message.id"
		:class="[
			'msg',
			{
				self: message.self,
				highlight: message.highlight || focused,
				'previous-source': isPreviousSource,
			},
		]"
		:data-type="message.type"
		:data-command="message.command"
		:data-from="message.from && message.from.nick"
	>
		<span
			aria-hidden="true"
			:aria-label="messageTimeLocale"
			class="time tooltipped tooltipped-e"
			>{{ `${messageTime}&#32;` }}
		</span>
		<template v-if="message.type === 'unhandled'">
			<span class="from">[{{ message.command }}]</span>
			<span class="content">
				<span v-for="(param, id) in message.params" :key="id">{{
					`&#32;${param}&#32;`
				}}</span>
			</span>
		</template>
		<template v-else-if="isAction()">
			<span class="from"><span class="only-copy">***&nbsp;</span></span>
			<component :is="messageComponent" :network="network" :message="message" />
		</template>
		<template v-else-if="message.type === 'action'">
			<span class="from"><span class="only-copy">*&nbsp;</span></span>
			<span class="content" dir="auto">
				<Username
					:user="message.from"
					:network="network"
					:channel="channel"
					dir="auto"
				/>&#32;<ParsedMessage :message="message" />
				<LinkPreview
					v-for="preview in message.previews"
					:key="preview.link"
					:keep-scroll-position="keepScrollPosition"
					:link="preview"
					:channel="channel"
				/>
			</span>
		</template>
		<template v-else>
			<span v-if="message.type === 'message'" class="from">
				{{
					(() => {
						log(network.discourseURL);
					})()
				}}
				<div
					v-if="
						message.from &&
						message.from.nick == network.MC_BOT &&
						message.text.substring(0, 4) == `03[`
					"
				>
					<!-- && (message.text.split(/:/).length) -->
					<!-- {{ parse(message.text.split(/:/)[0], message, network) }} -->
					<!-- {{ parse(message.text.split(/:/)[0]) }} -->
					<ParsedMessage :text="message.text.split(/:/)[0] + ':'" />
				</div>
				<div v-else>
					<template v-if="message.from && message.from.nick">
						<span class="only-copy" aria-hidden="true">&lt;</span>
						<Username :user="message.from" :network="network" :channel="channel" />
						<span class="only-copy" aria-hidden="true">&gt;&nbsp;</span>
					</template>
				</div>
			</span>
			<span v-else-if="message.type === 'plugin'" class="from">
				<template v-if="message.from && message.from.nick">
					<span class="only-copy" aria-hidden="true">[</span>
					{{ message.from.nick }}
					<span class="only-copy" aria-hidden="true">]&nbsp;</span>
				</template>
			</span>
			<span v-else class="from">
				<template v-if="message.from && message.from.nick">
					<span class="only-copy" aria-hidden="true">-</span>
					<Username :user="message.from" :network="network" :channel="channel" />
					<span class="only-copy" aria-hidden="true">-&nbsp;</span>
				</template>
			</span>
			<span class="content" dir="auto">
				<span
					v-if="message.showInActive"
					aria-label="This message was shown in your active channel"
					class="msg-shown-in-active tooltipped tooltipped-e"
					><span></span
				></span>
				<span
					v-if="message.statusmsgGroup"
					:aria-label="`This message was only shown to users with ${message.statusmsgGroup} mode`"
					class="msg-statusmsg tooltipped tooltipped-e"
					><span>{{ message.statusmsgGroup }}</span></span
				>
				<div
					v-if="
						message.from &&
						message.from.nick == network.MC_BOT &&
						message.text.substring(0, 4) == `03[`
					"
				>
					<ParsedMessage
						:network="network"
						:text="
							message.text.substring(
								message.text.split(/:/)[0].length + 2,
								message.text.length
							)
						"
					/>
				</div>
				<ParsedMessage v-else :network="network" :message="message" />

				<LinkPreview
					v-for="preview in message.previews"
					:key="preview.link"
					:keep-scroll-position="keepScrollPosition"
					:link="preview"
					:channel="channel"
				/>
			</span>
		</template>
	</div>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, PropType, ref} from "vue";
import dayjs from "dayjs";

import constants from "../js/constants";
import localetime from "../js/helpers/localetime";
import Username from "./Username.vue";
import LinkPreview from "./LinkPreview.vue";
import ParsedMessage from "./ParsedMessage.vue";
import MessageTypes from "./MessageTypes";

import type {ClientChan, ClientMessage, ClientNetwork} from "../js/types";
import {useStore} from "../js/store";
import {Message} from "../../server/models/msg";
import parse from "../js/helpers/parse";
import {log} from "console";
import {channel} from "diagnostics_channel";
import network from "../../server/models/network";
import socket from "../js/socket";
import {NetworkFormDefaults} from "./NetworkForm.vue";

MessageTypes.ParsedMessage = ParsedMessage;
MessageTypes.LinkPreview = LinkPreview;
MessageTypes.Username = Username;

export default defineComponent({
	name: "Message",
	components: MessageTypes,
	props: {
		message: {type: Object as PropType<ClientMessage>, required: true},
		channel: {type: Object as PropType<ClientChan>, required: false},
		network: {type: Object as PropType<ClientNetwork>, required: true},
		keepScrollPosition: Function as PropType<() => void>,
		isPreviousSource: Boolean,
		focused: Boolean,
	},
	setup(props) {
		const store = useStore();

		const timeFormat = computed(() => {
			let format: keyof typeof constants.timeFormats;

			if (store.state.settings.use12hClock) {
				format = store.state.settings.showSeconds ? "msg12hWithSeconds" : "msg12h";
			} else {
				format = store.state.settings.showSeconds ? "msgWithSeconds" : "msgDefault";
			}

			return constants.timeFormats[format];
		});

		const messageTime = computed(() => {
			return dayjs(props.message.time).format(timeFormat.value);
		});

		const messageTimeLocale = computed(() => {
			return localetime(props.message.time);
		});

		const messageComponent = computed(() => {
			return "message-" + (props.message.type || "invalid"); // TODO: force existence of type in sharedmsg
		});

		const isAction = () => {
			if (!props.message.type) {
				return false;
			}

			return typeof MessageTypes["message-" + props.message.type] !== "undefined";
		};

		// Ensure we have the MC-BOT username
		const networkData = ref<NetworkFormDefaults | null>(null);

		const setNetworkData = () => {
			socket.emit("network:get", String(props.network.uuid || ""));
			networkData.value = store.getters.findNetwork(String(props.network.uuid || ""));
		};

		onMounted(() => {
			setNetworkData();
		});

		return {
			timeFormat,
			messageTime,
			messageTimeLocale,
			messageComponent,
			isAction,
			parse,
			log: console.log,
			setItem: localStorage.setItem,
		};
	},
});

export function mcsplit(message: Message) {
	return JSON.stringify(message.text.split(/[\][:]/)) as string;
}
</script>
