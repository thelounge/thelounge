{{> ../user_name}}
invited
{{#if invitedYou}}
	you
{{else}}
	{{> ../user_name_target}}
{{/if}}
to
{{{parse channel}}}
