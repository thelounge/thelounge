{{#each results}}

	<div class="date-marker">
		<span class="date-marker-text" data-label="{{network}}"></span>
		<span class="date-marker-text" data-label="{{chan}}"></span>
		<span class="date-marker-text" data-label="{{friendlydate time}}"></span>
	</div>
	{{#each before}}
		{{> msg}}
	{{/each}}

	{{> msg}}

	{{#each after}}
		{{> msg}}
	{{/each}}
{{/each}}

<div class="show-more {{#equal results.length 20}}show{{/equal}}">
	<button class="show-more-button">Show older messages</button>
</div>
