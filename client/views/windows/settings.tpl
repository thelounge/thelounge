<div class="header">
	<button class="lt" aria-label="{{translate index.toggle_chan_list}}"></button></div>
</div>
<div class="container">
	<h1 class="title">{{translate index.settings.title}}</h1>

	<div class="row">
		<div class="col-sm-12">
			<h2>{{translate index.settings.messages}}</h2>
		</div>
		<div class="col-sm-6">
			<label class="opt">
				<input type="checkbox" name="motd">
				Show <abbr title="Message Of The Day">MOTD</abbr>
			</label>
		</div>
		<div class="col-sm-6">
			<label class="opt">
				<input type="checkbox" name="showSeconds">
				{{translate index.settings.show_sec_in_ts}}
			</label>
		</div>
		<div class="col-sm-12">
			<h2>
				{{translate index.settings.status_messages}}
				<span class="tooltipped tooltipped-n tooltipped-no-delay" aria-label="{{translate index.settings.condense_list}}">
					<button class="extra-help" aria-label="{{translate index.settings.condense_list}}"></button>
				</span>
			</h2>
		</div>
		<div class="col-sm-12">
			<label class="opt">
				<input type="radio" name="statusMessages" value="shown">
				{{translate index.settings.show_status_messages_individullay}}
			</label>
			<label class="opt">
				<input type="radio" name="statusMessages" value="condensed">
				{{translate index.settings.condense_status_together}}
			</label>
			<label class="opt">
				<input type="radio" name="statusMessages" value="hidden">
				{{translate index.settings.hide_all_status_messages}}
			</label>
		</div>
		<div class="col-sm-12">
			<h2>{{translate index.settings.visual_aids}}</h2>
		</div>
		<div class="col-sm-12">
			<label class="opt">
				<input type="checkbox" name="coloredNicks">
				{{translate index.settings.enable_color_nicks}}
			</label>
			<label class="opt">
				<input type="checkbox" name="autocomplete">
				{{translate index.settings.enable_auto_complete}}
			</label>
		</div>
		<div class="col-sm-12">
			<label class="opt">
				<label for="nickPostfix" class="sr-only">Nick autocomplete postfix (e.g. <code>, </code>)</label>
				<input type="text" id="nickPostfix" name="nickPostfix" class="input" placeholder="Nick autocomplete postfix (e.g. ', ')">
			</label>
		</div>

		<div class="col-sm-12">
			<h2>{{translate index.settings.theme}}</h2>
		</div>
		<div class="col-sm-12">
			<label for="theme-select" class="sr-only">{{translate index.settings.theme}}</label>
			<select id="theme-select" name="theme" class="input">
				{{#each themes}}
					<option value="{{name}}">
						{{displayName}}
					</option>
				{{/each}}
			</select>
		</div>
		{{#if prefetch}}
		<div class="col-sm-12">
			<h2>{{translate index.settings.link_previews}}</h2>
		</div>
		<div class="col-sm-6">
			<label class="opt">
				<input type="checkbox" name="media">
				{{translate index.settings.auto_expand_media}}
			</label>
		</div>
		<div class="col-sm-6">
			<label class="opt">
				<input type="checkbox" name="links">
				{{translate index.settings.auto_expand_websites}}
			</label>
		</div>
		{{/if}}
		{{#unless public}}
		<div class="col-sm-12">
			<h2>{{translate index.settings.push_notifications.title}}</h2>
		</div>
		<div class="col-sm-12">
			<button type="button" class="btn" id="pushNotifications" disabled data-text-alternate="Unsubscribe from push notifications">{{translate index.settings.push_notifications.subscribe}}</button>
			<div class="error" id="pushNotificationsHttps">
				<strong>{{translate index.settings.push_notifications.warning}}</strong>:
				{{translate index.settings.push_notifications.https}}
			</div>
			<div class="error" id="pushNotificationsUnsupported">
				<strong>{{translate index.settings.push_notifications.warning}}</strong>:
				<span>{{translate index.settings.push_notifications.not_supported}}</span>
			</div>
		</div>
		{{/unless}}
		<div class="col-sm-12">
			<h2>{{translate index.settings.browser_notifications}}</h2>
		</div>
		<div class="col-sm-12">
			<label class="opt">
			<input id="desktopNotifications" type="checkbox" name="desktopNotifications">
			{{translate index.settings.enable_browser_notif}}<br>
			<div class="error" id="warnUnsupportedDesktopNotifications">
				<strong>{{translate index.settings.warning}}</strong>:
				{{translate index.settings.notif_not_supported}}
			</div>
			<div class="error" id="warnBlockedDesktopNotifications">
				<strong>{{translate index.settings.warning}}</strong>:
				{{translate index.settings.notif_blocked}}
			</div>
			</label>
		</div>
		<div class="col-sm-12">
			<label class="opt">
			<input type="checkbox" name="notification">
			{{translate index.settings.enable_notif_sound}}
			</label>
		</div>
		<div class="col-sm-12">
			<div class="opt">
				<button id="play">{{translate index.settings.play_sound}}</button>
			</div>
		</div>

		<div class="col-sm-12">
			<label class="opt">
				<input type="checkbox" name="notifyAllMessages">
				{{translate index.settings.enable_notif_all_msgs}}
			</label>
		</div>

		<div class="col-sm-12">
			<label class="opt">
				<label for="highlights" class="sr-only">{{translate index.settings.custom_highlights}}</label>
				<input type="text" id="highlights" name="highlights" class="input" placeholder="{{translate index.settings.custom_highlights_placeholder}}">
			</label>
		</div>

		{{#unless public}}
			{{#unless ldapEnabled}}
		<div id="change-password">
			<form action="" method="post" data-event="change-password">
				<div class="col-sm-12">
					<h2>{{translate index.settings.change_password}}</h2>
				</div>
				<div class="col-sm-12">
					<label for="old_password_input" class="sr-only">{{translate index.settings.enter_current_password}}</label>
					<input type="password" id="old_password_input" name="old_password" class="input" placeholder="{{translate index.settings.enter_current_password}}">
				</div>
				<div class="col-sm-12">
					<label for="new_password_input" class="sr-only">{{translate index.settings.enter_new_password}}</label>
					<input type="password" id="new_password_input" name="new_password" class="input" placeholder="{{translate index.settings.enter_new_password}}">
				</div>
				<div class="col-sm-12">
					<label for="verify_password_input" class="sr-only">{{translate index.settings.repeat_new_password}}</label>
					<input type="password" id="verify_password_input" name="verify_password" class="input" placeholder="{{translate index.settings.repeat_new_password}}">
				</div>
				<div class="col-sm-12 feedback"></div>
				<div class="col-sm-12">
					<button type="submit" class="btn">{{translate index.settings.change_password}}</button>
				</div>
			</form>
		</div>
			{{/unless}}
		{{/unless}}
		<div class="col-sm-12">
			<h2>{{translate index.settings.custom_stylesheet}}</h2>
		</div>
		<div class="col-sm-12">
			<label for="user-specified-css-input" class="sr-only">{{translate index.settings.custom_stylesheet_placeholder}}</label>
			<textarea class="input" name="userStyles" id="user-specified-css-input" placeholder="/* {{translate index.settings.custom_stylesheet_placeholder}} */"></textarea>
		</div>
	</div>

	{{#unless public}}
		<div class="session-list">
			<h2>Sessions</h2>

			<h3>Current session</h3>
			<div id="session-current"></div>

			<h3>Other sessions</h3>
			<div id="session-list"></div>
		</div>
	{{/unless}}
</div>
