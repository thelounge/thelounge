{{#each messages}}
<div class="msg {{type}} {{#if self}}self{{/if}}">
	<span class="time">
		{{tz time}}
	</span>
	<span class="from">
		{{#if from}}
		<button class="user">{{from}}</button>
		{{/if}}
	</span>
	<span class="text">
		<em class="type">{{type}}</em>
		{{#equal type "image"}}
		<img src="{{text}}" class="image">
		{{else}}
		{{{uri text}}}
		{{/equal}}
	</span>
</div>
{{/each}}
