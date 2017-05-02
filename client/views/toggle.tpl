{{#toggle}}
<div class="toggle-content toggle-type-{{type}} {{#unless show}}hide{{/unless}}" data-id="{{id}}">
	{{#equal type "image"}}
		<img src="{{link}}">
	{{else}}
		{{#if thumb}}
			<img src="{{thumb}}" class="thumb">
		{{/if}}
		<a href="{{link}}" target="_blank">
			<div class="info_wrap">
				{{#if head}}<div class="head">{{head}}</div>{{/if}}
				<div class="body">
					{{body}}
				</div>
			</div>
		</a>
	{{/equal}}
</div>
{{/toggle}}
