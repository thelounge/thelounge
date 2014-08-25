{{#if users.length}}
<div class="count">
	<input class="search" placeholder="{{users.length}} users">
</div>
{{/if}}
<div class="names">
	{{#each users}}
	<button class="user">{{mode}}{{name}}</button>
	{{/each}}
</div>
