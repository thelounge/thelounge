{{#each channels}}
<div data-id="{{id}}" data-target="#chan-{{id}}" data-title="{{name}}" class="chan {{type}}">
	<span class="badge" data-count="{{unread}}">{{#if unread}}{{unread}}{{/if}}</span>
	<span class="close"></span>
	<span class="name">{{name}}</span>
</div>
{{/each}}
