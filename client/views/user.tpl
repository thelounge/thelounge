{{#if users.length}}
<div class="count">
	<input class="search" placeholder="{{users users.length}}">
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
			<button class="user" style="color: #{{stringcolor name}}" data-name="{{name}}">{{mode}}{{name}}</button>
		{{/each}}
		</div>
	</div>
</div>
