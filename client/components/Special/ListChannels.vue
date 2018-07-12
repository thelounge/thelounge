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
				<td class="channel"><ParsedMessage :text="chan.channel"/></td>
				<td class="users">{{ chan.num_users }}</td>
				<td class="topic"><ParsedMessage :text="chan.topic"/></td>
			</tr>
		</tbody>
	</table>
</template>

<script>
import ParsedMessage from "../ParsedMessage.vue";

export default {
	name: "ListChannels",
	components: {
		ParsedMessage,
	},
	props: {
		channel: Object,
	},
};
</script>
