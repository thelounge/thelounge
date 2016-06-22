<a href="#" class="user {{colorClass from}}" data-name="{{from}}">{{from}}</a>
invited
{{#if invitedYou}}
	you
{{else}}
	<a href="#" class="user {{colorClass invited}}" data-name="{{invited}}">{{invited}}</a>
{{/if}}
to
{{{parse channel}}}
