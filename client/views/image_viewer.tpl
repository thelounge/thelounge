<button class="close-btn" aria-label="Close"></button>

{{#if hasPreviousImage}}
  <button class="previous-image-btn" aria-label="Previous image"></button>
{{/if}}

{{#if hasNextImage}}
  <button class="next-image-btn" aria-label="Next image"></button>
{{/if}}

<a class="image-link" href="{{link}}" target="_blank">
  <img src="{{image}}" alt="Preview of {{link}}">
</a>

<a class="btn open-btn" href="{{link}}" target="_blank">
  {{#equal type "image"}}
    Open image
  {{else}}
    Visit page
  {{/equal}}
</a>
