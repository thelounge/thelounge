{{> ../user_name from}}
{{translate 'client.has_kicked'}}
{{> ../user_name target}}
{{#if text}}
	<i class="part-reason">({{{parse text}}})</i>
{{/if}}
