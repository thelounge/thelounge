{{#preview}}
<button class="toggle-button toggle-preview {{#if shown}} opened{{/if}}"
  data-url="{{link}}"
  {{#equal type "image"}}
    aria-label="{{translate 'client.toggle_image_preview'}}"
  {{else}}
    aria-label="{{translate 'client.toggle_website_preview'}}"
  {{/equal}}
></button>
{{/preview}}
