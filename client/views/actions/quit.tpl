{{> ../user_name from}}
<i class="hostmask">({{hostmask}})</i>
{{translate 'client.has_quit'}}
{{#if text}}
	<i class="quit-reason">({{{parse text}}})</i>
{{/if}}
