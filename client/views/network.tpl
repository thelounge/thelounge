{{#each networks}}
<section id="network-{{id}}" class="network name-{{slugify name}} network-{{slugify serverOptions.NETWORK}}" data-id="{{id}}" data-nick="{{nick}}" data-options="{{tojson serverOptions}}">
	{{> chan}}
</section>
{{/each}}
