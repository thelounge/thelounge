{{#each networks}}
<section
	id="network-{{id}}"
	class="network name-{{slugify name}} {{#if serverOptions.NETWORK}}network-{{slugify serverOptions.NETWORK}}{{/if}} {{#unless status.connected}}not-connected{{/unless}} {{#unless status.secure}}not-secure{{/unless}}"
	data-id="{{id}}"
	data-nick="{{nick}}"
	data-options="{{tojson serverOptions}}"
>
	<button class="collapse-network" aria-label="Collapse" data-id="{{id}}"
		aria-controls="network-{{id}}-chanlist" aria-expanded="true"></button>
	<div id="network-{{id}}-chanlist" role="region" class="chanlist">
	{{> chan}}
	</div>
</section>
{{/each}}
