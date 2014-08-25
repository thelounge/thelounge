{{#each channels}}
<div id="chan-{{id}}" data-id="{{id}}" data-type="{{type}}" class="chan {{type}}">
	<div class="header">
		<button class="lt"></button>
		<button class="rt"></button>
		<span class="title">{{name}}</span>
		<span class="topic">{{type}} </span>
	</div>
	<div class="chat">
		{{#equal 100 messages.length}}
		<button class="show-more" data-id="{{id}}">
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
