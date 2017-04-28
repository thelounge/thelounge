{{#each networks}}
<section id="network-{{id}}" class="network name-{{slugify name}} {{#if serverOptions.NETWORK}}network-{{slugify serverOptions.NETWORK}}{{/if}}" data-id="{{id}}" data-nick="{{nick}}" data-options="{{tojson serverOptions}}">
	{{> chan}}
</section>
{{/each}}
