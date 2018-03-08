{{#each channels}}
<div
	class="chan {{type}} chan-{{slugify name}}"
	data-id="{{id}}"
	data-target="#chan-{{id}}"
	role="tab"
	aria-label="{{name}}"
	aria-controls="chan-{{id}}"
	aria-selected="false"
>
	{{#equal type "lobby"}}
		<button class="collapse-network" aria-label="Collapse" aria-controls="network-{{id}}" aria-expanded="true">
			<span class="collapse-network-icon"></span>
		</button>
		<div class="lobby-wrap">
			<span class="name" title="{{name}}">{{name}}</span>
			<span class="not-secure-tooltip tooltipped tooltipped-w" aria-label="Insecure connection">
				<span class="not-secure-icon"></span>
			</span>
			<span class="not-connected-tooltip tooltipped tooltipped-w" aria-label="Disconnected">
				<span class="not-connected-icon"></span>
			</span>
			<span class="badge{{#if highlight}} highlight{{/if}}">{{#if unread}}{{roundBadgeNumber unread}}{{/if}}</span>
		</div>
		<span class="add-channel-tooltip tooltipped tooltipped-w tooltipped-no-touch" aria-label="Join a channel…" data-alt-label="Cancel">
			<button class="add-channel" aria-label="Join a channel…" data-id="{{id}}"></button>
		</span>
	{{/equal}}
	{{#notEqual type "lobby"}}
		<span class="name" title="{{name}}">{{name}}</span>
		<span class="badge{{#if highlight}} highlight{{/if}}">{{#if unread}}{{roundBadgeNumber unread}}{{/if}}</span>
		<span class="close-tooltip tooltipped tooltipped-w" aria-label="Leave">
			<button class="close" aria-label="Leave"></button>
		</span>
	{{/notEqual}}
</div>
{{#equal type "lobby"}}
	{{> join_channel}}
{{/equal}}
{{/each}}
