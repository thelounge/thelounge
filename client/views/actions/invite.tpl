<a href="#" class="user" data-name="{{from}}" style="color:#{{stringcolor from}}">{{from}}</a>
invited
{{#if invitedYou}}
	you
{{else}}
	<a href="#" class="user" data-name="{{invited}}" style="color:#{{stringcolor invited}}">{{invited}}</a>
{{/if}}
to
{{{parse channel}}}
