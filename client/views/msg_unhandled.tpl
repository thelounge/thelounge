<div class="msg msg-{{slugify command}} {{type}}{{#if self}} self{{/if}}{{#if highlight}} highlight{{/if}}" data-time="{{time}}">
	<span class="time tooltipped tooltipped-e" aria-label="{{localetime time}}">
		{{tz time}}
	</span>
	<span class="from">[{{command}}]</span>
	<span class="content">
		{{#each params}}
			<span>{{this}}</span>
		{{/each}}
	</span>
</div>
