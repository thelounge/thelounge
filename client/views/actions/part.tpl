{{> ../user_name from}}
<i class="hostmask">({{hostmask}})</i>
{{translate 'client.has_left'}}
{{#if text}}
	<i class="part-reason">({{{parse text}}})</i>
{{/if}}
