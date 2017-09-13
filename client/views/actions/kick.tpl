{{> ../user_name nick=from mode=""}}
has kicked
{{> ../user_name nick=target mode=""}}
{{#if text}}
	<i class="part-reason">({{{parse text}}})</i>
{{/if}}
