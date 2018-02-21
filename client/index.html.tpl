<!doctype html>
<html lang="en-US">
	<head>

	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">

	<link rel="preload" as="script" href="js/bundle.vendor.js">
	<link rel="preload" as="script" href="js/bundle.js">
	<link rel="stylesheet" href="css/bootstrap.css">
	<link rel="stylesheet" href="css/primer-tooltips.css">
	<link rel="stylesheet" href="css/style.css">
	<link id="theme" rel="stylesheet" href="themes/<%- theme %>.css" data-server-theme="<%- theme %>">
	<% _.forEach(stylesheets, function(css) { %>
		<link rel="stylesheet" href="packages/<%- css %>">
	<% }); %>
	<style id="user-specified-css"></style>

	<title>The Lounge</title>

	<link rel="shortcut icon" href="img/favicon.png" data-other="img/favicon-notification.png" data-toggled="false" id="favicon">
	<link rel="apple-touch-icon" sizes="120x120" href="img/apple-touch-icon-120x120.png">
	<link rel="mask-icon" href="img/logo.svg" color="<%- themeColor %>">
	<link rel="manifest" href="manifest.json">

	<meta name="apple-mobile-web-app-capable" content="yes">
	<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
	<meta name="mobile-web-app-capable" content="yes">
	<meta name="theme-color" content="<%- themeColor %>">

	</head>
	<body class="signed-out<%- public ? " public" : "" %>" data-transports="<%- JSON.stringify(transports) %>">

	<div id="wrap">
	<div id="viewport" role="tablist">
		<aside id="sidebar">
			<div class="networks"></div>
			<div class="empty">
				{{translate index.not_connected}}
			</div>
		</aside>
		<footer id="footer">
			<span class="tooltipped tooltipped-n tooltipped-no-touch" aria-label="index.sign_in"><button class="icon sign-in" data-target="#sign-in" aria-label="index.sign_in" role="tab" aria-controls="sign-in" aria-selected="false"></button></span>
			<span class="tooltipped tooltipped-n tooltipped-no-touch" aria-label="index.connect_to_network"><button class="icon connect" data-target="#connect" aria-label="index.connect_to_network" role="tab" aria-controls="connect" aria-selected="false"></button></span>
			<span class="tooltipped tooltipped-n tooltipped-no-touch" aria-label="index.settings_label"><button class="icon settings" data-target="#settings" aria-label="index.settings_label" role="tab" aria-controls="settings" aria-selected="false"></button></span>
			<span class="tooltipped tooltipped-n tooltipped-no-touch" aria-label="index.help_label"><button class="icon help" data-target="#help" aria-label="index.help_label" role="tab" aria-controls="help" aria-selected="false"></button></span>
			<span class="tooltipped tooltipped-n tooltipped-no-touch" aria-label="index.sign_out"><button class="icon sign-out" id="sign-out" aria-label="index.sign_out"></button></span>
		</footer>
		<div id="main">
			<div id="windows">
				<div id="loading" class="window active">
					<div class="container">
						<div class="row">
							<div class="col-xs-12">
								<h1 class="title" id="loading-title">{{translate index.loading}}</h1>
							</div>
							<div class="col-xs-12">
								<p id="loading-page-message">Loading the app… <a href="http://enable-javascript.com/" target="_blank" rel="noopener">Make sure to have JavaScript enabled.</a></p>
								<p id="loading-slow">
									This is taking longer than it should, there might be
									connectivity issues.
								</p>
								<button id="loading-reload" class="btn">Reload page</button>
								<script async src="js/loading-error-handlers.js"></script>
							</div>
						</div>
					</div>
				</div>
				<div id="chat-container" class="window">
					<div id="chat"></div>
					<div id="connection-error"></div>
					<form id="form" method="post" action="">
						<div class="input">
							<span id="nick">
								<span id="nick-value" spellcheck="false"></span><!-- Comments here remove spaces between elements
								--><span id="set-nick-tooltip" class="tooltipped tooltipped-e" aria-label="{{translate index.change_nick}}""><button id="set-nick" type="button" aria-label="{{translate index.change_nick}}"></button></span><!--
								--><span id="cancel-nick-tooltip" class="tooltipped tooltipped-e" aria-label="{{translate index.cancel}}"><button id="cancel-nick" type="button" aria-label="{{translate index.cancel}}"></button></span><!--
								--><span id="save-nick-tooltip" class="tooltipped tooltipped-e" aria-label="{{translate index.save}}"><button id="submit-nick" type="button" aria-label="{{translate index.save}}"></button></span>
							</span>
							<textarea id="input" class="mousetrap"></textarea>
							<span id="submit-tooltip" class="tooltipped tooltipped-w tooltipped-no-touch" aria-label="{{translate index.send_message}}">
								<button id="submit" type="submit" aria-label="{{translate index.send_message}}"></button>
							</span>
						</div>
					</form>
				</div>
				<div id="sign-in" class="window" role="tabpanel" aria-label="Sign-in"></div>
				<div id="connect" class="window" role="tabpanel" aria-label="Connect"></div>
				<div id="settings" class="window" role="tabpanel" aria-label="Settings"></div>
				<div id="help" class="window" role="tabpanel" aria-label="Help"></div>
				<div id="changelog" class="window" aria-label="Changelog"></div>
			</div>
		</div>
	</div>
	</div>

	<div id="context-menu-container">
		<ul id="context-menu"></ul>
	</div>

	<div id="image-viewer"></div>

	<script src="js/bundle.vendor.js"></script>
	<script src="js/bundle.js"></script>

	</body>
</html>
