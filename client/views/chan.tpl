{{#each channels}}
<div data-id="{{id}}" data-target="#chan-{{id}}" data-title="{{name}}" class="chan {{type}} chan-{{slugify name}}">
	<span class="badge{{#if highlight}} highlight{{/if}}">{{#if unread}}{{roundBadgeNumber unread}}{{/if}}</span>
	{{#notEqual type "lobby"}}<button class="close" aria-label="Close"></button>{{/notEqual}}
	<span class="name" title="{{name}}">{{name}}</span>
</div>
{{/each}}
