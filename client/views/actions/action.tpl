{{> ../user_name nick=from}}
<span class="action-text">{{{parse text}}}</span>

{{#each links}}
  <div class="preview" data-url="{{this}}"></div>
{{/each}}
