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
		<div class="toggle-text">
			<div class="head">
				<div class="overflowable">
					<a href="{{link}}" target="_blank" rel="noopener" title="{{head}}">
						{{head}}
					</a>
				</div>

				<button class="more"
					aria-expanded="false"
					aria-label="More"
					data-closed-text="More"
					data-opened-text="Less"
				>
					<span class="more-caret"></span>
				</button>
			</div>

			<div class="body overflowable">
				<a href="{{link}}" target="_blank" rel="noopener" title="{{body}}">
					{{body}}
				</a>
			</div>
			</a>
		</div>
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
			<div>
				<em>
					A preview could not be loaded.
					<a href="{{link}}" target="_blank" rel="noopener">Click here</a>
					to open it in a new window.
				</em>
				<br>
				<pre class="prefetch-error">{{message}}</pre>
			</div>

			<button class="more"
				aria-expanded="false"
				aria-label="More"
				data-closed-text="More"
				data-opened-text="Less"
			>
				<span class="more-caret"></span>
			</button>
		{{/equal}}
	{{/equal}}
</div>
{{/preview}}
