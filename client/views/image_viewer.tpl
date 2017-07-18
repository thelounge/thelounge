<button class="close-btn" aria-label="Close">×</button>

<a class="image-link" href="{{link}}" target="_blank">
  <img src="{{image}}">
</a>

<a class="btn open-btn" href="{{link}}" target="_blank">
  {{#equal type "image"}}
    Open image
  {{else}}
    Visit page
  {{/equal}}
</a>
