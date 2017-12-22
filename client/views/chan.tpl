{{#each channels}}
<div data-id="{{id}}" data-target="#chan-{{id}}" data-title="{{name}}" class="chan {{type}} chan-{{slugify name}}">
	<span class="badge{{#if highlight}} highlight{{/if}}">{{#if unread}}{{roundBadgeNumber unread}}{{/if}}</span>
	{{#equal type "lobby"}}{{else}}<button class="close" aria-label="Close"></button>{{/equal}}
	<span class="name" title="{{name}}">{{name}}</span>
</div>
{{/each}}
