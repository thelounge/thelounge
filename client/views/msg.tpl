<div class="msg {{type}}{{#if self}} self{{/if}}{{#if highlight}} highlight{{/if}}{{#if sameSender}} equal-from{{/if}}" id="msg-{{id}}" data-time="{{time}}">
	<span class="time" title="{{localetime time}}">
		{{tz time}}
	</span>
	<span class="from">
		{{#if from}}
		<span role="button" class="user {{colorClass from}}" data-name="{{from}}">{{mode}}{{from}}</span>
		{{/if}}
	</span>
	{{#equal type "toggle"}}
		<span class="text">
			<div class="force-newline">
				<button id="toggle-{{id}}" class="toggle-button" aria-label="Toggle prefetched media">···</button>
			</div>
			{{#if toggle}}
				{{partial "toggle"}}
			{{/if}}
		</span>
	{{else}}
		<span class="text">{{{parse text}}}</span>
	{{/equal}}
	</span>
</div>
