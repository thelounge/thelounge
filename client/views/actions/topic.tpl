{{#if from}}
	{{> ../user_name nick=from}}
	has changed the topic to:
{{else}}
	The topic is:
{{/if}}

<span class="new-topic">{{{parse text}}}</span>
