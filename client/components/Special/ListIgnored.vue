<template>
	<table class="ignore-list">
		<thead>
			<tr>
				<th class="hostmask">Hostmask</th>
				<th class="when">Ignored At</th>
			</tr>
		</thead>
		<tbody>
			<tr
				v-for="user in channel.data"
				:key="user.hostmask">
				<td class="hostmask">{{ user.hostmask }}</td>
				<td class="when">{{ user.when | localetime }}</td>
			</tr>
		</tbody>
	</table>
</template>

<script>
export default {
	name: "ListIgnored",
	props: {
		channel: Object,
	},
};
</script>
