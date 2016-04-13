<div>
	<a href="#" class="user" data-name="{{whois.nick}}">{{whois.nick}}</a>
	<i class="hostmask">({{whois.user}}@{{whois.host}})</i>:
	<b>{{whois.real_name}}</b>
</div>
{{#if whois.account}}
<div>
	<a href="#" class="user" data-name="{{whois.nick}}">{{whois.nick}}</a>
	is logged in as <b>{{whois.account}}</b>
</div>
{{/if}}
{{#if whois.channels}}
<div>
	<a href="#" class="user" data-name="{{whois.nick}}">{{whois.nick}}</a>
	is on the following channels: {{{parse whois.channels}}}
</div>
{{/if}}
{{#if whois.server}}
<div>
	<a href="#" class="user" data-name="{{whois.nick}}">{{whois.nick}}</a>
	is connected to {{whois.server}} <i>({{whois.server_info}})</i>
</div>
{{/if}}
{{#if whois.secure}}
<div>
	<a href="#" class="user" data-name="{{whois.nick}}">{{whois.nick}}</a>
	is using a secure connection
</div>
{{/if}}
{{#if whois.away}}
<div>
	<a href="#" class="user" data-name="{{whois.nick}}">{{whois.nick}}</a>
	is away <i>({{whois.away}})</i>
</div>
{{/if}}
