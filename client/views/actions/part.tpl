{{> ../user_name nick=from}}
{{#if hostmask}}
	<i class="hostmask">({{hostmask}})</i>
{{/if}}
has left the channel
{{#if text}}
	<i class="part-reason">({{{parse text}}})</i>
{{/if}}
