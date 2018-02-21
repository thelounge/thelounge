<table class="channel-list">
	<thead>
		<tr>
			<th class="channel">{{translate 'client.channel_list.channel'}}</th>
			<th class="users">{{translate 'client.channel_list.users'}}</th>
			<th class="topic">{{translate 'client.channel_list.topic'}}</th>
		</tr>
	</thead>
	<tbody>
		{{#each channels}}
			<tr>
				<td class="channel">{{{parse channel}}}</td>
				<td class="users">{{num_users}}</td>
				<td class="topic">{{{parse topic}}}</td>
			</tr>
		{{/each}}
	</tbody>
</table>
