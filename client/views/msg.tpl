<div
	class="msg {{type}}{{#if self}} self{{/if}}{{#if highlight}} highlight{{/if}}"
	id="msg-{{id}}"
	data-time="{{time}}"{{#if from.nick}} data-from="{{from.nick}}"{{/if}}
>
	<strong class="from">
		{{#if from.nick}}
			{{> user_name from}}
		{{/if}}
	</strong>
	<span class="time tooltipped tooltipped-e" aria-label="{{localetime time}}">
		{{tz time}}
	</span>
	<div class="content">
		<span class="text">{{{parse text users}}}</span>

		{{#each previews}}
			<div class="preview" data-url="{{link}}"></div>
		{{/each}}
	</div>
</div>
