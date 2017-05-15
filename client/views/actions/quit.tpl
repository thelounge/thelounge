{{> ../user_name nick=from}}
<i class="hostmask">({{hostmask}})</i>
has quit
{{#if text}}
	<i class="quit-reason">({{{parse text}}})</i>
{{/if}}
