<template>
	<table class="ignore-list">
		<thead>
			<tr>
				<th class="hostmask">Hostmask</th>
				<th class="when">Ignored At</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="user in channel.data" :key="user.hostmask">
				<td class="hostmask"><ParsedMessage :network="network" :text="user.hostmask" /></td>
				<td class="when">{{ localetime(user.when) }}</td>
			</tr>
		</tbody>
	</table>
</template>

<script lang="ts">
import ParsedMessage from "../ParsedMessage.vue";
import localetime from "../../js/helpers/localetime";
import {defineComponent, PropType} from "vue";
import {ClientNetwork, ClientChan} from "../../js/types";

export default defineComponent({
	name: "ListIgnored",
	components: {
		ParsedMessage,
	},
	props: {
		network: {type: Object as PropType<ClientNetwork>, required: true},
		channel: {type: Object as PropType<ClientChan>, required: true},
	},
	setup() {
		return {
			localetime,
		};
	},
});
</script>
