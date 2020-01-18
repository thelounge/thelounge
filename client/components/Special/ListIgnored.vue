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
				<td class="hostmask">{{ user.hostmask }}</td>
				<td class="when">{{ localetime(user.when) }}</td>
			</tr>
		</tbody>
	</table>
</template>

<script>
import localetime from "../../js/helpers/localetime";

export default {
	name: "ListIgnored",
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
