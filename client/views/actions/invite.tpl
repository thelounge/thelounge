{{> ../user_name from}}
invited
{{#if invitedYou}}
	you
{{else}}
	{{> ../user_name invited}}
{{/if}}
to
{{{parse channel}}}
