{{#if from}}
	{{> ../user_name from}}
	has changed the topic to:
{{else}}
	The topic is:
{{/if}}

<span class="new-topic">{{{parse text}}}</span>
