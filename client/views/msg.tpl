<div class="msg {{type}}{{#if self}} self{{/if}}{{#if highlight}} highlight{{/if}}" id="msg-{{id}}" data-time="{{time}}" data-from="{{from}}">
	<span class="time tooltipped tooltipped-e" aria-label="{{localetime time}}">
		{{tz time}}
	</span>
	<span class="from">
		{{#if from}}
			{{> user_name nick=from}}
		{{/if}}
	</span>
	<span class="text">
		{{~{parse text}~}}
		{{#if preview}}
			{{> msg_preview}}
		{{/if}}
	</span>
</div>
