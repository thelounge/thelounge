import React from 'react';
import _ from 'lodash';

// import { useState } from 'clientUI/utils/forms';


export default class SettingsWindow extends React.Component {
	constructor () {
		super();
	}

	renderPrefetch () {
		const prefetch = false; // TODO
		if (!prefetch) {
			return null;
		}

		return (
			<div>
				<div className="col-sm-12">
					<h2>Links and URLs</h2>
				</div>
				<div className="col-sm-6">
					<label className="opt">
						<input type="checkbox" name="thumbnails" />
						Auto-expand thumbnails
					</label>
				</div>
				<div className="col-sm-6">
					<label className="opt">
						<input type="checkbox" name="links" />
						Auto-expand links
					</label>
				</div>
			</div>
		);
	}

	renderPassword () {
		const isPublic = false; // TODO
		const ldap = { enable: false }; // TODO
		if (isPublic && ldap.enable) {
			return null;
		}

		return (
			<div id="change-password">
				<form>
					<div className="col-sm-12">
						<h2>Change password</h2>
					</div>
					<div className="col-sm-12">
						<label
							htmlFor="old_password_input"
							className="sr-only"
						>
							Enter current password
						</label>
						<input
							type="password"
							id="old_password_input"
							name="old_password"
							className="input"
							placeholder="Enter current password"
						/>
					</div>
					<div className="col-sm-12">
						<label
							htmlFor="new_password_input"
							className="sr-only"
						>
							Enter desired new password
						</label>
						<input
							type="password"
							id="new_password_input"
							name="new_password"
							className="input"
							placeholder="Enter desired new password"
						/>
					</div>
					<div className="col-sm-12">
						<label
							htmlFor="verify_password_input"
							className="sr-only"
						>
							Repeat new password
						</label>
						<input
							type="password"
							id="verify_password_input"
							name="verify_password"
							className="input"
							placeholder="Repeat new password"
						/>
					</div>
					<div className="col-sm-12 feedback"></div>
					<div className="col-sm-12">
						<button type="submit" className="btn">Change password</button>
					</div>
				</form>
			</div>
		);
	}

	renderVersionInfo () {
		const gitCommit = false; // TODO
		const version = 'IDK THE VERSION LOL';

		if (gitCommit) {
			return (<p>
				The Lounge is running from source
				(
				<a
					href={'https://github.com/thelounge/lounge/tree/' + gitCommit}
					target="_blank"
				>
					<code>{gitCommit}</code>
				</a>
				).
				<br />
			</p>);
		}
		return (<p>
			The Lounge is in version <strong>{version}</strong>
			(
			<a
				href={'https://github.com/thelounge/lounge/releases/tag/v' + version}
				target="_blank"
			>
				See release notes
			</a>
			).
			<br />
		</p>);
	}

	render () {
		const themes = [].map(themeName => ( // TODO
			<option value={themeName}>
				{_.capitalize(themeName)}
			</option>
		));

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
							<label
								className="sr-only"
								htmlFor="theme-select"
							>
								Theme
							</label>
							<select id="theme-select" name="theme" className="input">
								{themes}
							</select>
						</div>

						{this.renderPrefetch()}

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
								<label
									className="sr-only"
									htmlFor="highlights"
								>
									Custom highlights (comma-separated keywords)
								</label>
								<input
									type="text"
									id="highlights"
									name="highlights"
									className="input"
									placeholder="Custom highlights (comma-separated keywords)"
								/>
							</label>
						</div>

						{this.renderPassword()}

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
							<div className="about">
								{this.renderVersionInfo()}

								<a href="https://thelounge.github.io/" target="_blank">Website</a><br />
								<a href="https://thelounge.github.io/docs/" target="_blank">Documentation</a><br />
								<a href="https://github.com/thelounge/lounge/issues/new" target="_blank">Report a bug</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
