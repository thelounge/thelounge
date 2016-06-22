<span role="button" class="user {{colorClass from}}" data-name="{{from}}">{{from}}</span>
invited
{{#if invitedYou}}
	you
{{else}}
	<span role="button" class="user {{colorClass invited}}" data-name="{{invited}}">{{invited}}</span>
{{/if}}
to
{{{parse channel}}}
