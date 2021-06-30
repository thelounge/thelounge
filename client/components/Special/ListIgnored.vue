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

<script>
import ParsedMessage from "../ParsedMessage.vue";
import localetime from "../../js/helpers/localetime";

export default {
	name: "ListIgnored",
	components: {
		ParsedMessage,
	},
	props: {
		network: Object,
		channel: Object,
	},
	methods: {
		localetime(date) {
			return localetime(date);
		},
	},
};
</script>
