<div class="msg {{type}}{{#if self}} self{{/if}}{{#if highlight}} highlight{{/if}}" id="msg-{{id}}">
	<span class="time" title="{{localetime time}}">
		{{tz time}}
	</span>
	<span class="from">
		{{#if from}}
		<span role="button" class="user {{colorClass from}}" data-name="{{from}}">{{mode}}{{from}}</span>
		{{/if}}
	</span>
		<span class="text">{{{parse text}}}
		{{#equal type "url"}}
			<br>
			<button id="toggle-{{id}}" class="toggle-button" aria-label="Toggle media">···</button>
		{{/equal}}</span>

	</span>
</div>
