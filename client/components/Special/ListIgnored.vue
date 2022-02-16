<template>
	<div v-if="channel.data.length === 0" class="empty-ignore-list">Your ignorelist is empty.</div>
	<table v-else class="ignore-list">
		<thead>
			<tr>
				<th class="hostmask">Hostmask</th>
				<th class="when">Ignored At</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="user in channel.data" :key="user.hostmask">
				<td class="hostmask"><ParsedMessage :network="network" :text="user.hostmask" /></td>
				<td class="when">{{ getLocaletime(user.when) }}</td>
			</tr>
		</tbody>
	</table>
</template>

<style scoped>
.empty-ignore-list {
	padding: 0 0.5rem;
}
</style>

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
		getLocaletime(datetime) {
			return localetime(datetime);
		},
	},
};
</script>
