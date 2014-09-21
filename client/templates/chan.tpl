{{#each channels}}
<button data-id="{{id}}" data-target="#chan-{{id}}" data-title="{{name}}" class="chan {{type}}">
	<span class="badge">{{#if unread}}{{unread}}{{/if}}</span>
	<span class="close"></span>
	{{name}}
</button>
{{/each}}
