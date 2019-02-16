<template>
	<table class="ban-list">
		<thead>
			<tr>
				<th class="hostmask">Banned</th>
				<th class="banned_by">Banned By</th>
				<th class="banned_at">Banned At</th>
			</tr>
		</thead>
		<tbody>
			<tr
				v-for="ban in channel.data"
				:key="ban.hostmask">
				<td class="hostmask">{{ ban.hostmask }}</td>
				<td class="banned_by">{{ ban.banned_by }}</td>
				<td class="banned_at">{{ ban.banned_at | localetime }}</td>
			</tr>
		</tbody>
	</table>
</template>

<script>
export default {
	name: "ListBans",
	props: {
		network: Object,
		channel: Object,
	},
};
</script>
