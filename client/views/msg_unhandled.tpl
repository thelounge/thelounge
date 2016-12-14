<div class="msg {{type}}{{#if self}} self{{/if}}{{#if highlight}} highlight{{/if}}" data-time="{{time}}">
	<span class="time" title="{{localetime time}}">
		{{tz time}}
	</span>
	<span class="from">[{{command}}]</span>
	<span class="text">
		{{#each params}}
			<span>
				{{this}}{{#equal ../command "421"}}{{#if @first}}:{{/if}}{{/equal}}
			</span>
		{{/each}}
	</span>
</div>
