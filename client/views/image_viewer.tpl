<button class="close-btn" aria-label="Close"></button>

{{#if hasPreviousImage}}
  <button class="previous-image-btn" aria-label="{{translate 'client.previous_image'}}"></button>
{{/if}}

{{#if hasNextImage}}
  <button class="next-image-btn" aria-label="{{translate 'client.next_image'}}"></button>
{{/if}}

<a class="image-link" href="{{link}}" target="_blank">
  <img src="{{image}}" decoding="async" alt="">
</a>

<a class="btn open-btn" href="{{link}}" target="_blank">
  {{#equal type "image"}}
    {{translate 'client.open_image'}}
  {{else}}
    {{translate 'client.visit_page'}}
  {{/equal}}
</a>
