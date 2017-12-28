{{#preview}}
<div class="toggle-content toggle-type-{{type}}{{#if shown}} show{{/if}}">
	{{#equal type "image"}}
		<a class="toggle-thumbnail" href="{{link}}" target="_blank" rel="noopener">
			<img src="{{thumb}}" decoding="async" alt="">
		</a>
	{{/equal}}
	{{#equal type "audio"}}
		<audio controls preload="metadata">
			<source src="{{link}}" type="{{res}}">
			Your browser does not support the audio element.
		</audio>
	{{/equal}}
	{{#equal type "video"}}
		<video width="320" height="240" preload="metadata" controls>
			<source src="{{link}}" type="{{res}}">
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
		<a class="toggle-text" href="{{link}}" target="_blank" rel="noopener">
			<div class="head" title="{{head}}">{{head}}</div>
			<div class="body" title="{{body}}">{{body}}</div>
		</a>
	{{/equal}}
</div>
{{/preview}}
