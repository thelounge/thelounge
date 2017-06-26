<div class="msg {{type}}{{#if self}} self{{/if}}{{#if highlight}} highlight{{/if}}" id="msg-{{id}}" data-time="{{time}}" data-from="{{from}}">
	<span class="time tooltipped tooltipped-e" aria-label="{{localetime time}}">
		{{tz time}}
	</span>
	<span class="from">
		{{#if from}}
			{{> user_name nick=from}}
		{{/if}}
	</span>
	{{#equal type "toggle"}}
		<span class="text">
			{{#if toggle}}
				{{> toggle}}
			{{/if}}
		</span>
	{{else}}
		<span class="text">{{{parse text}}}</span>
	{{/equal}}
	</span>
</div>
