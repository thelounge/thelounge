{{#each channels}}
<div
	id="chan-{{id}}"
	class="chan {{type}}"
	data-id="{{id}}"
	data-type="{{type}}"
	role="tabpanel"
	aria-label="{{name}}"
>
	<div class="header">
		<button class="lt" aria-label="Toggle channel list"></button>
		<span class="title">{{name}}</span>
		<span title="{{topic}}" class="topic">{{{parse topic}}}</span>
		<button class="menu" aria-label="Open the context menu"></button>
		{{#equal type "channel"}}
			<span class="rt-tooltip tooltipped tooltipped-w" aria-label="Toggle user list">
				<button class="rt" aria-label="Toggle user list"></button>
			</span>
		{{/equal}}
	</div>
	<div class="chat-content">
		<div class="chat">
			<div class="show-more{{#if messages.length}} show{{/if}}">
				<button class="show-more-button" data-id="{{id}}">Show older messages</button>
			</div>
			<div class="messages" role="log" aria-live="polite" aria-relevant="additions"></div>
		</div>
		{{#equal type "channel"}}
		<aside class="userlist">
			<div class="count">
				<input type="search" class="search" aria-label="Search among the user list" tabindex="-1">
			</div>
			<div class="names names-filtered"></div>
			<div class="names names-original"></div>
		</aside>
		{{/equal}}
	</div>
</div>
{{/each}}
