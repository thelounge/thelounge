<div class="msg {{type}}{{#if self}} self{{/if}}{{#if highlight}} highlight{{/if}}" id="msg-{{id}}" data-time="{{time}}" data-from="{{from}}">
	<span class="time tooltipped tooltipped-e" aria-label="{{localetime time}}">
		{{tz time}}
	</span>
	<span class="from">
		{{#if from.nick}}
			{{> user_name from}}
		{{/if}}
	</span>
	<span class="content">
		<span class="text">{{{parse text users}}}</span>

		{{#each previews}}
			<div class="preview" data-url="{{link}}"></div>
		{{/each}}
	</span>
</div>
