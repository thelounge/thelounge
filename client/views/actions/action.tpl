{{> ../user_name nick=from}}
<span class="text">{{{parse text}}}</span>

{{#each previews}}
	<div class="preview" data-url="{{link}}"></div>
{{/each}}
