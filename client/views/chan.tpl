{{#each channels}}
<div data-id="{{id}}" data-target="#chan-{{id}}" data-title="{{name}}" class="chan {{type}}">
	<span class="badge{{#if highlight}} highlight{{/if}}" data-count="{{unread}}">{{#if unread}}{{unread}}{{/if}}</span>
	<span class="close"></span>
	<span class="name" title="{{name}}">{{name}}</span>
</div>
{{/each}}
