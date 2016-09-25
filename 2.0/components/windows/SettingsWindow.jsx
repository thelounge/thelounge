import React from 'react';

export default class SettingsWindow extends React.Component {
	render () {
		return (
			<div id="settings" className="window">
				<div className="header">
					<button className="lt" aria-label="Toggle channel list"></button>
				</div>
				<div className="container">
					<div className="row">
						<div className="col-sm-12">
							<h1 className="title">Settings</h1>
						</div>
						<div className="col-sm-12">
							<h2>Messages</h2>
						</div>
						<div className="col-sm-6">
							<label className="opt">
								<input type="checkbox" name="join" />
								Show joins
							</label>
						</div>
						<div className="col-sm-6">
							<label className="opt">
								<input type="checkbox" name="motd" />
								Show <abbr title="Message Of The Day">MOTD</abbr>
							</label>
						</div>
						<div className="col-sm-6">
							<label className="opt">
								<input type="checkbox" name="part" />
								Show parts
							</label>
						</div>
						<div className="col-sm-6">
							<label className="opt">
								<input type="checkbox" name="nick" />
								Show nick changes
							</label>
						</div>
						<div className="col-sm-6">
							<label className="opt">
								<input type="checkbox" name="mode" />
								Show mode
							</label>
						</div>
						<div className="col-sm-6">
							<label className="opt">
								<input type="checkbox" name="quit" />
								Show quits
							</label>
						</div>
						<div className="col-sm-12">
							<h2>Visual Aids</h2>
						</div>
						<div className="col-sm-12">
							<label className="opt">
								<input type="checkbox" name="coloredNicks" />
								Enable colored nicknames
							</label>
						</div>
						<div className="col-sm-12">
							<h2>Theme</h2>
						</div>
						<div className="col-sm-12">
							{/* attr: for="theme-select" */}
							<label className="sr-only">Theme</label>
							<select id="theme-select" name="theme" className="input">
								{/* TODO: PUT THE MISSING SNIPPET BACK */}
							</select>
						</div>
						{/* TODO: PUT THE MISSING SNIPPET BACK */}
						<div className="col-sm-12">
							<h2>Notifications</h2>
						</div>
						<div className="col-sm-12">
							<label className="opt">
								<input id="desktopNotifications" type="checkbox" name="desktopNotifications" />
								Enable desktop notifications<br />
								<div className="error" id="warnDisabledDesktopNotifications"><strong>Warning</strong>: Desktop notifications are blocked by your web browser</div>
							</label>
						</div>
						<div className="col-sm-12">
							<label className="opt">
								<input type="checkbox" name="notification" />
								Enable notification sound
							</label>
						</div>
						<div className="col-sm-12">
							<div className="opt">
								<button id="play">Play sound</button>
							</div>
						</div>

						<div className="col-sm-12">
							<label className="opt">
								<input type="checkbox" name="notifyAllMessages" />
								Enable notification for all messages
							</label>
						</div>

						<div className="col-sm-12">
							<label className="opt">
								{/* attr: for="highlights" */}
								<label className="sr-only">Custom highlights (comma-separated keywords)</label>
								<input type="text" id="highlights" name="highlights" className="input" placeholder="Custom highlights (comma-separated keywords)" />
							</label>
						</div>

						{/* TODO: PUT THE MISSING SNIPPET BACK */}
						<div className="col-sm-12">
							<h2>Custom Stylesheet</h2>
						</div>
						<div className="col-sm-12">
							<textarea className="input" name="userStyles" id="user-specified-css-input" placeholder="You can override any style with CSS here"></textarea>
						</div>
						<div className="col-sm-12">
							<h2>About The Lounge</h2>
						</div>
						<div className="col-sm-12">
							<p className="about">
								{/* TODO: PUT THE MISSING SNIPPET BACK */}

								<a href="https://thelounge.github.io/" target="_blank">Website</a><br />
								<a href="https://thelounge.github.io/docs/" target="_blank">Documentation</a><br />
								<a href="https://github.com/thelounge/lounge/issues/new" target="_blank">Report a bug</a>
							</p>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
