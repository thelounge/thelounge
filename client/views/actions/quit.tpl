{{> ../user_name nick=from}}
{{#if hostmask}}
	<i class="hostmask">({{hostmask}})</i>
{{/if}}
has quit
{{#if text}}
	<i class="quit-reason">({{{parse text}}})</i>
{{/if}}
