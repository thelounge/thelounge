{{#preview}}
<div class="toggle-content-wrap{{#if shown}} toggle-content-show{{/if}}">
	<div>
		<button class="toggle-button" aria-label="Toggle prefetched media"></button>
	</div>
	<a href="{{link}}" target="_blank" rel="noopener" class="toggle-content toggle-type-{{type}}">
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
</div>
{{/preview}}
