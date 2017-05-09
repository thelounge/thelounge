{{#if from}}
	<span role="button" class="user {{colorClass from}}" data-name="{{from}}">{{mode}}{{from}}</span>
{{else}}
	<span role="button" class="user {{colorClass nick}}" data-name="{{nick}}">{{mode}}{{nick}}</span>
{{/if}}
