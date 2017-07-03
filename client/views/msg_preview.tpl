{{#preview}}
<div>
	<button class="toggle-button" aria-label="Toggle prefetched media"></button>
</div>
<a href="{{link}}" target="_blank" rel="noopener" class="toggle-content toggle-type-{{type}}{{#if shown}} show{{/if}}">
	{{#equal type "image"}}
		<img src="{{link}}">
	{{else}}
		{{#if thumb}}
			<img src="{{thumb}}" class="thumb">
		{{/if}}
		<div class="head">{{head}}</div>
		<div class="body">
			{{body}}
		</div>
	{{/equal}}
</a>
{{/preview}}
