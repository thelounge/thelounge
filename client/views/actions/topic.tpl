{{#if from.nick}}
	{{> ../user_name from}}
	{{translate 'client.topic.has_changed'}}
{{else}}
	{{translate 'client.topic.topic_is'}}
{{/if}}

<span class="new-topic">{{{parse text}}}</span>
