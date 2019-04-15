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
			<tr
				v-for="invite in channel.data"
				:key="invite.hostmask"
			>
				<td class="hostmask">{{ invite.hostmask }}</td>
				<td class="invitened_by">{{ invite.invited_by }}</td>
				<td class="invitened_at">{{ invite.invited_at | localetime }}</td>
			</tr>
		</tbody>
	</table>
</template>

<script>
export default {
	name: "ListInvites",
	props: {
		network: Object,
		channel: Object,
	},
};
</script>
