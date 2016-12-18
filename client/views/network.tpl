{{#each networks}}
<section id="network-{{id}}" class="network" data-id="{{id}}" data-nick="{{nick}}" data-options="{{tojson serverOptions}}">
	{{> chan}}
</section>
{{/each}}
