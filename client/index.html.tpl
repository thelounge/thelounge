<!doctype html>
<html>
	<head>

	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, user-scalable=no">

	<link rel="preload" as="script" href="js/bundle.vendor.js">
	<link rel="preload" as="script" href="js/bundle.js">
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
		<div id="viewport" role="tablist">
			<aside id="sidebar">
				<div class="networks"></div>
				<div class="empty">
					You're not connected to any networks yet.
				</div>
				<footer id="footer">
					<span class="tooltipped tooltipped-n tooltipped-no-touch" aria-label="Sign in"><button class="icon sign-in" data-target="#sign-in" aria-label="Sign in" role="tab" aria-controls="sign-in" aria-selected="false"></button></span>
					<span class="tooltipped tooltipped-n tooltipped-no-touch" aria-label="Connect to network"><button class="icon connect" data-target="#connect" aria-label="Connect to network" role="tab" aria-controls="connect" aria-selected="false"></button></span>
					<span class="tooltipped tooltipped-n tooltipped-no-touch" aria-label="Settings"><button class="icon settings" data-target="#settings" aria-label="Settings" role="tab" aria-controls="settings" aria-selected="false"></button></span>
					<span class="tooltipped tooltipped-n tooltipped-no-touch" aria-label="Help"><button class="icon help" data-target="#help" aria-label="Help" role="tab" aria-controls="help" aria-selected="false"></button></span>
				</footer>
			</aside>
			<div id="sidebar-overlay"></div>
			<article id="windows">
				<div id="loading" class="window active">
					<div id="loading-status-container">
						<img src="img/logo-vertical-transparent-bg.svg" class="logo" alt="The Lounge" width="256" height="170">
						<img src="img/logo-vertical-transparent-bg-inverted.svg" class="logo-inverted" alt="The Lounge" width="256" height="170">
						<p id="loading-page-message"><a href="https://enable-javascript.com/" target="_blank" rel="noopener">Your JavaScript must be enabled.</a></p>
					</div>
					<div id="loading-reload-container">
						<p id="loading-slow">This is taking longer than it should, there might be connectivity issues.</p>
						<button id="loading-reload" class="btn">Reload page</button>
					</div>
					<script async src="js/loading-error-handlers.js"></script>
				</div>
				<div id="chat-container" class="window">
					<div id="chat"></div>
					<div id="connection-error"></div>
					<form id="form" method="post" action="">
						<div class="input">
							<span id="nick">
								<span id="nick-value" spellcheck="false"></span><!-- Comments here remove spaces between elements
								--><span id="set-nick-tooltip" class="tooltipped tooltipped-e" aria-label="Change nick…"><button id="set-nick" type="button" aria-label="Change nick…"></button></span><!--
								--><span id="cancel-nick-tooltip" class="tooltipped tooltipped-e" aria-label="Cancel"><button id="cancel-nick" type="button" aria-label="Cancel"></button></span><!--
								--><span id="save-nick-tooltip" class="tooltipped tooltipped-e" aria-label="Save"><button id="submit-nick" type="button" aria-label="Save"></button></span>
							</span>
							<textarea id="input" class="mousetrap"></textarea>
							<span id="submit-tooltip" class="tooltipped tooltipped-w tooltipped-no-touch" aria-label="Send message">
								<button id="submit" type="submit" aria-label="Send message"></button>
							</span>
						</div>
					</form>
				</div>
				<div id="sign-in" class="window" role="tabpanel" aria-label="Sign-in"></div>
				<div id="connect" class="window" role="tabpanel" aria-label="Connect"></div>
				<div id="settings" class="window" role="tabpanel" aria-label="Settings"></div>
				<div id="help" class="window" role="tabpanel" aria-label="Help"></div>
				<div id="changelog" class="window" aria-label="Changelog"></div>
			</article>
		</div>

		<div id="context-menu-container">
			<ul id="context-menu"></ul>
		</div>

		<div id="image-viewer"></div>

		<script src="js/bundle.vendor.js"></script>
		<script src="js/bundle.js"></script>
	</body>
</html>
