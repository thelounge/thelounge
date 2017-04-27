<div>
	{{> ../user_name_target}}
	<i class="hostmask">({{whois.user}}@{{whois.host}})</i>:
	<b>{{whois.real_name}}</b>
</div>
{{#if whois.account}}
<div>
	{{> ../user_name_target}}
	is logged in as <b>{{whois.account}}</b>
</div>
{{/if}}
{{#if whois.channels}}
<div>
	{{> ../user_name_target}}
	is on the following channels: {{{parse whois.channels}}}
</div>
{{/if}}
{{#if whois.server}}
<div>
	{{> ../user_name_target}}
	is connected to {{whois.server}} <i>({{whois.server_info}})</i>
</div>
{{/if}}
{{#if whois.secure}}
<div>
	{{> ../user_name_target}}
	is using a secure connection
</div>
{{/if}}
{{#if whois.away}}
<div>
	{{> ../user_name_target}}
	is away <i>({{whois.away}})</i>
</div>
{{/if}}
{{#if whois.idle}}
<div>
	{{> ../user_name_target}}
	has been idle since {{localetime whois.idleTime}}.
</div>
{{/if}}
