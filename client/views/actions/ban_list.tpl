<table class="ban-list">
	<thead>
		<tr>
			<th class="hostmask">{{translate 'client.ban_list.banned'}}</th>
			<th class="banned_by">{{translate 'client.ban_list.banned_by'}}</th>
			<th class="banned_at">{{translate 'client.ban_list.banned_at'}}</th>
		</tr>
	</thead>
	<tbody>
		{{#each bans}}
			<tr>
				<td class="hostmask">{{hostmask}}</td>
				<td class="banned_by">{{{parse banned_by}}}</td>
				<td class="banned_at">{{{localetime banned_at}}}</td>
			</tr>
		{{/each}}
	</tbody>
</table>
