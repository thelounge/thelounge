{{#each channels}}
<div id="chan-{{id}}" data-id="{{id}}" data-type="{{type}}" class="chan {{type}}">
	<div class="header">
		<button class="lt"></button>
		<button class="rt"></button>
		<div class="right">
			<button class="button close">
				{{#equal type "lobby"}}
					Disconnect
				{{else}}
					Leave
				{{/equal}}
			</button>
		</div>
		<span class="title">{{name}}</span>
		<span class="topic">{{type}} </span>
	</div>
	<div class="chat">
		{{#equal messages.length 100}}
		<button class="show-more" data-id="{{id}}">
			Show more
		</button>
		{{else}}
		<button class="show-more hidden" data-id="{{id}}">
			Show more
		</button>
		{{/equal}}
		<div class="messages">
			{{partial "msg"}}
		</div>
	</div>
	<aside class="sidebar">
		<div class="users">
			{{partial "user"}}
		</div>
	</aside>
</div>
{{/each}}
