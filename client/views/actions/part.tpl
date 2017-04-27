{{> ../user_name}}
<i class="hostmask">({{hostmask}})</i>
has left the channel
{{#if text}}
	<i class="part-reason">({{{parse text}}})</i>
{{/if}}
