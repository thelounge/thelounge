{{> ../user_name nick=from.nick mode=from.mode}}
has changed
{{#if new_ident}}username to <b>{{new_ident}}</b>{{#if new_host}}, and{{/if}}{{/if}}
{{#if new_host}}hostname to <i class="hostmask">{{new_host}}</i>{{/if}}
