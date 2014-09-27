{{#toggle}}
<div class="toggle-content">
	{{#equal type "image"}}
		<a href="{{link}}" target="_blank">
			<img src="{{link}}">
		</a>
	{{else}}
		<a href="{{link}}" target="_blank">
			<div class="head">{{{head}}}</div>
			<div class="body">
				{{body}}
			</div>
		</a>
	{{/equal}}
	</div>
</div>
{{/toggle}}
