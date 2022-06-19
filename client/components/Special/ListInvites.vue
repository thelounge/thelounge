<template>
	<table class="invite-list">
		<thead>
			<tr>
				<th class="hostmask">Invited</th>
				<th class="invitened_by">Invited By</th>
				<th class="invitened_at">Invited At</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="invite in channel.data" :key="invite.hostmask">
				<td class="hostmask">
					<ParsedMessage :network="network" :text="invite.hostmask" />
				</td>
				<td class="invitened_by">{{ invite.invited_by }}</td>
				<td class="invitened_at">{{ localetime(invite.invited_at) }}</td>
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
	name: "ListInvites",
	components: {
		ParsedMessage,
	},
	props: {
		network: {type: Object as PropType<ClientNetwork>, required: true},
		channel: {type: Object as PropType<ClientChan>, required: true},
	},
	setup() {
		return {
			localetime: (date: Date) => localetime(date),
		};
	},
});
</script>
