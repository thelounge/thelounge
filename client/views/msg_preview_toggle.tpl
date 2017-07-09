{{#preview}}
<button class="toggle-button {{#if shown}} opened{{/if}}"
  data-url="{{link}}"
  {{#equal type "image"}}
    aria-label="Toggle image preview"
  {{else}}
    aria-label="Toggle website preview"
  {{/equal}}
></button>
{{/preview}}
