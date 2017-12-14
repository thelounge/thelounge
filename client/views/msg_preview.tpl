{{#preview}}
<div class="toggle-content toggle-type-{{type}}{{#if shown}} show{{/if}}">
	{{#equal type "image"}}
		<a class="toggle-thumbnail" href="{{link}}" target="_blank" rel="noopener">
			<img src="{{thumb}}" decoding="async" alt="">
		</a>
	{{/equal}}
	{{#equal type "audio"}}
		<audio controls preload="metadata">
			<source src="{{media}}" type="{{mediaType}}">
			Your browser does not support the audio element.
		</audio>
	{{/equal}}
	{{#equal type "video"}}
		<video preload="metadata" controls>
			<source src="{{media}}" type="{{mediaType}}">
			Your browser does not support the video element.
		</video>
	{{/equal}}
	{{#equal type "link"}}
		{{#if thumb}}
			<a class="toggle-thumbnail" href="{{link}}" target="_blank" rel="noopener">
				<img src="{{thumb}}" decoding="async" alt="" class="thumb">
			</a>
		{{/if}}
		<a class="toggle-text" href="{{link}}" target="_blank" rel="noopener">
			<div class="head" title="{{head}}">{{head}}</div>
			<div class="body" title="{{body}}">{{body}}</div>
		</a>
	{{/equal}}
	{{#equal type "error"}}
		{{#equal error "image-too-big"}}
			<em>
				This image is larger than {{friendlysize maxSize}} and cannot be
				previewed.
				<a href="{{link}}" target="_blank" rel="noopener">Click here</a>
				to open it in a new window.
			</em>
		{{/equal}}
		{{#equal error "message"}}
			<em>
				There was an error loading preview for this link.
				<a href="{{link}}" target="_blank" rel="noopener">Click here</a>
				to open it in a new window.
				<small class="prefetch-error">({{message}})</small>
			</em>
		{{/equal}}
	{{/equal}}
</div>
{{/preview}}
