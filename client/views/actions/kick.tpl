{{> ../user_name nick=from mode=from_mode}}
has kicked
{{> ../user_name nick=target mode=target_mode}}
{{#if text}}
	<i class="part-reason">({{{parse text}}})</i>
{{/if}}
