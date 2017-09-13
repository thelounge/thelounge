{{> ../user_name nick=from.nick mode=from.mode}}
has kicked
{{> ../user_name nick=target.nick mode=target.mode}}
{{#if text}}
	<i class="part-reason">({{{parse text}}})</i>
{{/if}}
