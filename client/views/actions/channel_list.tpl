<table class="channel-list">
	<thead>
		<tr>
			<th class="channel">Channel</th>
			<th class="users">Users</th>
			<th class="topic">Topic</th>
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
