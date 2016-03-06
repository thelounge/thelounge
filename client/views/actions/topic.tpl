{{#if isSetByChan}}
	The topic is:
{{else}}
	<a href="#" class="user" data-name="{{from}}">{{mode}}{{from}}</a>
	has changed the topic to:
{{/if}}

<span class="new-topic">{{{parse text}}}</span>
