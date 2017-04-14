{{#each networks}}
<section id="network-{{id}}" class="network" data-id="{{id}}" data-nick="{{nick}}" data-options="{{tojson serverOptions}}">
	{{> chan lobby}}
	<div class="channel-list">
	{{#each chans}}
		{{> chan}}
	{{/each}}
	</div>
</section>
{{/each}}
