{{#toggle}}
<div class="toggle-content">
	{{#equal type "image"}}
		<a href="{{link}}" target="_blank">
			<img src="{{link}}">
		</a>
	{{/equal}}

	{{#equal type "link"}}
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

	{{#equal type "spotify.track"}}
		<iframe src="{{body}}"
				width="300"
				height="80"
				frameborder="0"
				allowtransparency="true">
		</iframe>
	{{/equal}}

	{{#equal type "spotify.album"}}
		<iframe src="{{body}}"
				width="300"
				height="380"
				frameborder="0"
				allowtransparency="true">
		</iframe>
	{{/equal}}

	{{#equal type "spotify.playlist"}}
		<iframe src="{{body}}"
				width="300"
				height="380"
				frameborder="0"
				allowtransparency="true">
		</iframe>
	{{/equal}}

	{{#equal type "spotify.artist"}}
	<iframe src="{{body}}"
			width="300"
			height="56"
			scrolling="no"
			frameborder="0"
			style="border:none; overflow:hidden;"
			allowtransparency="true">
	</iframe>
	{{/equal}}

	{{#equal type "spotify.user"}}
		<iframe src="{{body}}"
				width="300"
				height="56"
				scrolling="no"
				frameborder="0"
				style="border:none; overflow:hidden;"
				allowtransparency="true">
		</iframe>
	{{/equal}}

</div>
{{/toggle}}
