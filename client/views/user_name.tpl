{{#if from}}
	<span role="button" class="user {{colorClass from}}" style="{{colorOverride nick}}" data-name="{{from}}">{{mode}}{{from}}</span>
{{else}}
	<span role="button" class="user {{colorClass nick}}" style="{{colorOverride nick}}" data-name="{{nick}}">{{mode}}{{nick}}</span>
{{/if}}
