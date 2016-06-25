<div>
	<span role="button" class="user {{colorClass whois.nick}}" data-name="{{whois.nick}}">{{whois.nick}}</span>
	<i class="hostmask">({{whois.user}}@{{whois.host}})</i>:
	<b>{{whois.real_name}}</b>
</div>
{{#if whois.account}}
<div>
	<span role="button" class="user {{colorClass whois.nick}}" data-name="{{whois.nick}}">{{whois.nick}}</span>
	is logged in as <b>{{whois.account}}</b>
</div>
{{/if}}
{{#if whois.channels}}
<div>
	<span role="button" class="user {{colorClass whois.nick}}" data-name="{{whois.nick}}">{{whois.nick}}</span>
	is on the following channels: {{{parse whois.channels}}}
</div>
{{/if}}
{{#if whois.server}}
<div>
	<span role="button" class="user {{colorClass whois.nick}}" data-name="{{whois.nick}}">{{whois.nick}}</span>
	is connected to {{whois.server}} <i>({{whois.server_info}})</i>
</div>
{{/if}}
{{#if whois.secure}}
<div>
	<span role="button" class="user {{colorClass whois.nick}}" data-name="{{whois.nick}}">{{whois.nick}}</span>
	is using a secure connection
</div>
{{/if}}
{{#if whois.away}}
<div>
	<span role="button" class="user {{colorClass whois.nick}}" data-name="{{whois.nick}}">{{whois.nick}}</span>
	is away <i>({{whois.away}})</i>
</div>
{{/if}}
