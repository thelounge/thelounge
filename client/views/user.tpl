{{#diff "reset"}}{{/diff}}
{{#each users}}
	{{#diff mode}}
	{{#unless @first}}
		</div>
	{{/unless}}
	<div class="user-mode {{modes mode}}">
	{{/diff}}
	{{> user_name}}
{{/each}}
</div>
