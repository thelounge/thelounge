<div class="msg {{type}}{{#if self}} self{{/if}}{{#if highlight}} highlight{{/if}}">
	<span class="time">
		{{tz time}}
	</span>
	<span class="from">
		{{#if from}}
		<a href="#" class="user" style="color: #{{stringcolor from}}" data-name="{{from}}">{{mode}}{{from}}</a>
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
