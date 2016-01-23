<div class="msg {{type}} {{#if self}}self{{/if}}">
	<span class="time">
		{{tz time}}
	</span>
	<span class="from">
		{{#if from}}
		<button class="user" style="color: #{{stringcolor from}}">{{mode}}{{from}}</button>
		{{/if}}
	</span>
	<span class="text">
		{{#equal type "toggle"}}
			<div class="force-newline">
				<button id="toggle-{{id}}" class="toggle-button">···</button>
			</div>
			{{#if toggle}}
				{{partial "toggle"}}
			{{/if}}
		{{else}}
			{{{parse text}}}
		{{/equal}}
	</span>
</div>
