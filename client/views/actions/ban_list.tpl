<table class="ban-list">
	<thead>
		<tr>
			<th class="hostmask">Banned</th>
			<th class="banned_by">Banned By</th>
			<th class="banned_at">Banned At</th>
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
