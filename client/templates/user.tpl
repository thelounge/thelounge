{{#if users.length}}
<div class="count">
	<input class="search" placeholder="{{users users.length}}">
</div>
{{/if}}
<div class="names">
	{{#each users}}
	<button class="user">{{mode}}{{name}}</button>
	{{/each}}
</div>
