<div class="msg {{type}}{{#if self}} self{{/if}}{{#if highlight}} highlight{{/if}}"
	data-type="{{type}}" id="msg-{{id}}" data-time="{{time}}"{{#if from.nick}} data-from="{{from.nick}}"{{/if}}>
	<span class="time tooltipped tooltipped-e" aria-label="{{localetime time}}">
		{{tz time}}
	</span>
	<span class="from"></span>
	<span class="content"></span>
</div>
