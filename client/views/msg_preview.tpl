{{#preview}}
<a href="{{link}}" target="_blank" rel="noopener" class="toggle-content toggle-type-{{type}}{{#if shown}} show{{/if}}">
	{{#equal type "image"}}
		<img src="{{link}}">
	{{else}}
		{{#if thumb}}
			<img src="{{thumb}}" class="thumb">
		{{/if}}
		<div class="toggle-text">
			<div class="head" title="{{head}}">{{head}}</div>
			<div class="body" title="{{body}}">{{body}}</div>
		</div>
	{{/equal}}
</a>
{{/preview}}
