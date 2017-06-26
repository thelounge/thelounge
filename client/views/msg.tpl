<div class="msg {{type}}{{#if self}} self{{/if}}{{#if highlight}} highlight{{/if}}" id="msg-{{id}}" data-time="{{time}}" data-from="{{from}}">
	<span class="time tooltipped tooltipped-e" aria-label="{{localetime time}}">
		{{#equal type "toggle"}}
			{{tz time}}
		{{else}}
			<span class="clipboard">{{tz time}} </span>
		{{/equal}}
	</span>
	<span class="from">
		{{#if from}}
		<span class="clipboard clipboard-only">&lt;</span>
		<span role="button" class="user {{colorClass from}} clipboard" data-name="{{from}}">{{mode}}{{from}}</span>
		<span class="clipboard clipboard-only">&gt; </span>
		{{/if}}
	</span>
	{{#equal type "toggle"}}
		<span class="text">
			<div class="force-newline">
				<button id="toggle-{{id}}" class="toggle-button" aria-label="Toggle prefetched media">···</button>
			</div>
			{{#if toggle}}
				{{> toggle}}
			{{/if}}
		</span>
	{{else}}
		<span class="text clipboard">{{{parse text}}}</span>
		<span class="clipboard clipboard-only">&#13;</span>
	{{/equal}}
	</span>
</div>
