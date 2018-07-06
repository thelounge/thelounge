<table class="ignore-list">
	<thead>
		<tr>
			<th class="hostmask">Hostmask</th>
			<th class="when">Ignored At</th>
		</tr>
	</thead>
	<tbody>
		{{#each ignored}}
			<tr>
				<td class="hostmask">{{hostmask}}</td>
				<td class="when">{{{localetime when}}}</td>
			</tr>
		{{/each}}
	</tbody>
</table>
