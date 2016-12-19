<div class="msg {{type}}{{#if self}} self{{/if}}{{#if highlight}} highlight{{/if}}" data-time="{{time}}">
	<span class="time tooltipped tooltipped-e" aria-label="{{localetime time}}">
		{{tz time}}
	</span>
	<span class="from">[{{command}}]</span>
	<span class="text">
		{{#each params}}
			<span>{{this}}</span>
		{{/each}}
	</span>
</div>
