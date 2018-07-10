<template>
	<span v-if="channel.data.text">{{ channel.data.text }}</span>
	<table
		v-else
		class="channel-list">
		<thead>
			<tr>
				<th class="channel">Channel</th>
				<th class="users">Users</th>
				<th class="topic">Topic</th>
			</tr>
		</thead>
		<tbody>
			<tr
				v-for="chan in channel.data"
				:key="chan.channel">
				<td
					class="channel"
					v-html="$options.filters.parse(chan.channel)"/>
				<td class="users">{{ chan.num_users }}</td>
				<td
					class="topic"
					v-html="$options.filters.parse(chan.topic)"/>
			</tr>
		</tbody>
	</table>
</template>

<script>
export default {
	name: "ListChannels",
	props: {
		channel: Object,
	},
};
</script>
