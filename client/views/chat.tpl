{{#each channels}}
<div id="chan-{{id}}" data-title="{{name}}" data-id="{{id}}" data-type="{{type}}" data-target="#chan-{{id}}" class="chan {{type}}">
	<div class="header">
		<button class="lt" aria-label="Toggle channel list"></button>
		{{#equal type "channel"}}
			<span class="rt-tooltip tooltipped tooltipped-w" aria-label="Toggle user list">
				<button class="rt" aria-label="Toggle user list"></button>
			</span>
		{{/equal}}
		<button class="menu" aria-label="Open the context menu"></button>
		<span class="title">{{name}}</span>
		<span title="{{topic}}" class="topic">{{{parse topic}}}</span>
	</div>
	<div class="chat">
		<div class="show-more {{#equal messages.length 100}}show{{/equal}}">
			<button class="show-more-button" data-id="{{id}}">Show older messages</button>
		</div>
		<div class="messages"></div>
	</div>
	{{#equal type "channel"}}
	<aside class="sidebar">
		<div class="users">
			<div class="count">
				<input type="search" class="search" aria-label="Search among the user list" tabindex="-1">
			</div>
			<div class="names names-filtered"></div>
			<div class="names names-original"></div>
		</div>
	</aside>
	{{/equal}}
</div>
{{/each}}
