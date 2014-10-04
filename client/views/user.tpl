{{#if users.length}}
<div class="count">
	<input class="search" placeholder="{{users users.length}}">
</div>
{{/if}}
<div class="names">
	<div class="inner">
		{{#each users}}
		<button class="user" style="color: #{{stringcolor name}}">{{mode}}{{name}}</button>
		{{/each}}
	</div>
</div>
