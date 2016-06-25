{{#if users.length}}
<div class="count">
	<input class="search" placeholder="{{users users.length}}" aria-label="Search among the user list">
</div>
{{/if}}
<div class="names">
	<div class="inner">
		{{#diff "reset"}}{{/diff}}
		{{#each users}}
			{{#diff mode}}
			{{#unless @first}}
				</div>
			{{/unless}}
			<div class="user-mode {{modes mode}}">
			{{/diff}}
			<span role="button" class="user {{colorClass name}}" data-name="{{name}}">{{mode}}{{name}}</span>
		{{/each}}
		</div>
	</div>
</div>
