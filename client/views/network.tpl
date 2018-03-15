{{#each networks}}
<section
	id="network-{{id}}"
	class="network name-{{slugify name}} {{#if serverOptions.NETWORK}}network-{{slugify serverOptions.NETWORK}}{{/if}} {{#unless status.connected}}not-connected{{/unless}} {{#unless status.secure}}not-secure{{/unless}}"
	data-id="{{id}}"
	data-uuid="{{uuid}}"
	data-nick="{{nick}}"
	data-options="{{tojson serverOptions}}"
	role="region"
>
	{{> chan}}
</section>
{{/each}}
