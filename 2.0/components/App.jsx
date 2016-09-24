import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { setSomething } from 'clientUI/redux/chat';

import 'expose?$!expose?jQuery!jquery';

import 'font-awesome-webpack';
import 'bootstrap-webpack';
import './App.styl';


class App extends React.Component {
	render () {
		return (
			<div className='app-cmpt'>
				<div id='wrap'>
					<div id="viewport">
						<aside id="sidebar">
							<div className="networks"></div>
							<div className="empty">
								You're not connected to any networks yet.
							</div>
						</aside>
						<footer id="footer">
							<span className="tooltipped tooltipped-n" aria-label="Sign in"><button className="icon sign-in" data-target="#sign-in" aria-label="Sign in"></button></span>
							<span className="tooltipped tooltipped-n" aria-label="Connect to network"><button className="icon connect" data-target="#connect" aria-label="Connect to network"></button></span>
							<span className="tooltipped tooltipped-n" aria-label="Client settings"><button className="icon settings" data-target="#settings" aria-label="Client settings"></button></span>
							<span className="tooltipped tooltipped-n" aria-label="Sign out"><button className="icon sign-out" id="sign-out" aria-label="Sign out"></button></span>
						</footer>
						<div id="main">
							<div id="windows">
								<div id="loading" className="window active">
									<div className="container">
										<div className="row">
											<div className="col-xs-12">
												<h1 className="title">The Lounge is loading…</h1>
											</div>
											<div className="col-xs-12">
												<p id="loading-page-message">Loading the app… <a href="http://enable-javascript.com/" target="_blank">Make sure to have JavaScript enabled.</a></p>
												<p id="loading-slow">This is taking longer than it should, there might be connectivity issues.</p>
												<script async src="js/loading-slow-alert.js"></script>
											</div>
										</div>
									</div>
								</div>
								<div id="chat-container" className="window">
									<div id="chat"></div>
									<form id="form" method="post" action="">
										<div className="input">
											{/* for="input" */}
											<label id="nick"></label>
											<textarea id="input" className="mousetrap"></textarea>
											<span className="tooltipped tooltipped-w" aria-label="Send message">
												<button id="submit" type="submit" aria-label="Send message"></button>
											</span>
										</div>
									</form>
								</div>
								<div id="sign-in" className="window">
									<form className="container" method="post" action="">
										<div className="row">
											<div className="col-xs-12">
												<h1 className="title">Sign in to The Lounge</h1>
											</div>
											<div className="col-xs-12">
												<label>
													Username
													<input className="input" name="user" />
												</label>
											</div>
											<div className="col-xs-12">
												<label className="port">
													Password
													<input className="input" type="password" name="password" />
												</label>
											</div>
											<div className="col-xs-12">
												<label className="remember">
													{/* attr: checked */}
													<input type="checkbox" name="remember" id="sign-in-remember" />
													Stay signed in
												</label>
											</div>
											<div className="col-xs-12 error" style={{ display: 'none' }}>
												Authentication failed.
											</div>
											<div className="col-xs-12">
												<button type="submit" className="btn">
													Sign in
												</button>
											</div>
										</div>
									</form>
								</div>
								<div id="connect" className="window">
									<div className="header">
										<button className="lt" aria-label="Toggle channel list"></button>
									</div>
									<form className="container" method="post" action="">
										<div className="row">
											<div className="col-sm-12">
												<h1 className="title">
													{/* TODO: PUT THE MISSING SNIPPET BACK */}
													Connect
												</h1>
											</div>
											{/* TODO: PUT THE MISSING SNIPPET BACK */}
											<div >
												<div className="col-sm-12">
													<h2>Network settings</h2>
												</div>
												<div className="col-sm-3">
													{/* attr: for="connect:name" */}
													<label>Name</label>
												</div>
												<div className="col-sm-9">
													{/* TODO: PUT THE MISSING SNIPPET BACK */}
													<input className="input" id="connect:name" name="name" value="" />
												</div>
												<div className="col-sm-3">
													{/* attr: for="connect:host" */}
													<label>Server</label>
												</div>
												<div className="col-sm-6 col-xs-8">
													{/* TODO: PUT THE MISSING SNIPPET BACK */}
													<input className="input" id="connect:host" name="host" value="" aria-label="Server address" />
												</div>
												<div className="col-sm-3 col-xs-4">
													<div className="port">
														{/* TODO: PUT THE MISSING SNIPPET BACK */}
														<input className="input" type="number" min="1" max="65535" name="port" value="" aria-label="Server port" />
													</div>
												</div>
												<div className="clearfix"></div>
												<div className="col-sm-3">
													{/* attr: for="connect:password" */}
													<label>Password</label>
												</div>
												<div className="col-sm-9">
													{/* TODO: PUT THE MISSING SNIPPET BACK */}
													<input className="input" id="connect:password" type="password" name="password" value="" />
												</div>
												<div className="col-sm-9 col-sm-offset-3">
													<label className="tls">
														{/* TODO: PUT THE MISSING SNIPPET BACK */}
														<input type="checkbox" name="tls" />
														Enable TLS/SSL
													</label>
												</div>
												<div className="clearfix"></div>
											</div>
											<div className="col-sm-12">
												<h2>User preferences</h2>
											</div>
											<div className="col-sm-3">
												{/* attr: for="connect:nick" */}
												<label>Nick</label>
											</div>
											<div className="col-sm-9">
												{/* TODO: PUT THE MISSING SNIPPET BACK */}
												<input className="input nick" id="connect:nick" name="nick" value="" />
											</div>
											<div className="col-sm-3">
												{/* attr: for="connect:username" */}
												<label>Username</label>
											</div>
											<div className="col-sm-9">
												{/* TODO: PUT THE MISSING SNIPPET BACK */}
												<input className="input username" id="connect:username" name="username" value="" />
											</div>
											<div className="col-sm-3">
												{/* attr: for="connect:realname" */}
												<label>Real name</label>
											</div>
											<div className="col-sm-9">
												{/* TODO: PUT THE MISSING SNIPPET BACK */}
												<input className="input" id="connect:realname" name="realname" value="" />
											</div>
											<div className="col-sm-3">
												{/* attr: for="connect:channels" */}
												<label>Channels</label>
											</div>
											<div className="col-sm-9">
												{/* TODO: PUT THE MISSING SNIPPET BACK */}
												<input className="input" id="connect:channels" name="join" value="" />
											</div>
											<div className="col-sm-9 col-sm-offset-3">
												<button type="submit" className="btn">Connect</button>
											</div>
										</div>
									</form>
								</div>
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
							</div>
						</div>
					</div>
				</div>

				<div id="context-menu-container">
					<ul id="context-menu"></ul>
				</div>
			</div>
		);
	}
}

App.propTypes = {
	something: PropTypes.number
};

const mapStateToProps = state => {
	return {
		something: state.chat.something
	};
};

const mapDispatchToProps = dispatch => {
	return { };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
