{{#if from}}
	<a href="#" class="user" data-name="{{from}}">{{mode}}{{from}}</a>
	has changed the topic to:
{{else}}
	The topic is:
{{/if}}

<span class="new-topic">{{{parse text}}}</span>
