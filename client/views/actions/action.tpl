{{> ../user_name from}}
<span class="text">{{{parse text users}}}</span>

{{#each previews}}
	<div class="preview" data-url="{{link}}"></div>
{{/each}}
