{{#if self}}
	{{{parse text}}}
{{else}}
	{{> ../user_name from}}
	is away
	<i class="away-message">({{{parse text}}})</i>
{{/if}}
