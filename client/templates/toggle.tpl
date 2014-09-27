<div class="toggle-content">
	{{#equal type "image"}}
		<a href="{{body}}" target="_blank">
			<img src="{{body}}">
		</a>
	{{else}}
		<div class="head">{{head}}</div>
		<div class="body">
			{{body}}
		</div>
	{{/equal}}
	</div>
</div>
