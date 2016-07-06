<div class="msg {{type}}{{#if self}} self{{/if}}{{#if highlight}} highlight{{/if}}" id="msg-{{id}}">
	<span class="time">
		{{tz time}}
	</span>
	<span class="from"></span>
	<span class="text">
		{{partial template}}
	</span>
</div>
