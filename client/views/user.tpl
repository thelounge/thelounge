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
