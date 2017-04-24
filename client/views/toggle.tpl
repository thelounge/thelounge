{{#toggle}}
<div class="toggle-content toggle-type-{{type}}">
	{{#equal type "image"}}
		<a href="{{link}}" target="_blank">
			<img src="{{link}}">
		</a>
	{{else}}
		<a href="{{link}}" target="_blank">
			{{#if thumb}}
				<img src="{{thumb}}" class="thumb">
			{{/if}}
			<div class="head">{{head}}</div>
			<div class="body">
				{{body}}
			</div>
		</a>
	{{/equal}}
</div>
{{/toggle}}
