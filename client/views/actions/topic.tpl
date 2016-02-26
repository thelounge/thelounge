{{#if isSetByChan}}
	The topic is:
{{else}}
	<a href="#" class="user">{{mode}}{{from}}</a>
	has changed the topic to:
{{/if}}

<span class="new-topic">{{{parse text}}}</span>
