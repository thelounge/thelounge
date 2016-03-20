{{#each channels}}
<div id="chan-{{id}}" data-title="{{name}}" data-id="{{id}}" data-type="{{type}}" data-target="#chan-{{id}}" class="chan {{type}}">
	<div class="header">
		<button class="lt"></button>
		{{#equal type "channel"}}
			<button class="rt"></button>
		{{/equal}}
		<button class="menu"></button>
		<span class="title">{{name}}</span>
		<span class="topic">{{{parse topic}}}</span>
	</div>
	<div class="chat">
		<div class="show-more {{#equal messages.length 100}}show{{/equal}}">
			<button class="show-more-button" data-id="{{id}}">
				Show more
			</button>
		</div>
		<div class="messages"></div>
	</div>
	<aside class="sidebar">
		<div class="users">
			{{partial "user"}}
		</div>
	</aside>
</div>
{{/each}}
