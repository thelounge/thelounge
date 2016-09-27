import React from 'react';
import { connect } from 'react-redux';

import socketClient from 'clientUI/socketClient';
import { useState } from 'clientUI/utils/forms';


class ConnectWindow extends React.Component {
	constructor () {
		super();
		this.state = {
			submitting: false,
			formValues: {
				// Network
				name: 'Freenode',
				host: 'chat.freenode.net',
				port: 6697,
				password: '',
				tls: true,
				// User
				nick: 'lounge-user',
				username: 'lounge-user',
				realname: 'The Lounge User',
				join: '#thelounge'
			}
		};
	}

	handleSubmit (evt) {
		evt.preventDefault();
		this.setState({ submitting: true });
		socketClient.emit('conn', this.state.formValues);
	}

	renderNetworkSettings () {
		const lockNetwork = false;

		return (
			<div>
				<div className="col-sm-12">
					<h2>Network settings</h2>
				</div>
				<div className="col-sm-3">
					<label htmlFor="connect:name">Name</label>
				</div>
				<div className="col-sm-9">
					<input
						id="connect:name"
						className="input"
						{...useState(this, 'formValues.name')}
					/>
				</div>
				<div className="col-sm-3">
					<label htmlFor="connect:host">Server</label>
				</div>
				<div className="col-sm-6 col-xs-8">
					<input
						id="connect:host"
						className="input"
						{...useState(this, 'formValues.host')}
						aria-label="Server address"
						disabled={lockNetwork}
					/>
				</div>
				<div className="col-sm-3 col-xs-4">
					<div className="port">
						<input
							id="connect:port"
							className="input"
							type="number"
							min="1"
							max="65535"
							{...useState(this, 'formValues.port')}
							aria-label="Server port"
							disabled={lockNetwork}
						/>
					</div>
				</div>
				<div className="clearfix"></div>
				<div className="col-sm-3">
					<label htmlFor="connect:password">Password</label>
				</div>
				<div className="col-sm-9">
					<input
						id="connect:password"
						className="input"
						type="password"
						{...useState(this, 'formValues.password')}
					/>
				</div>
				<div className="col-sm-9 col-sm-offset-3">
					<label className="tls">
						<input
							type="checkbox"
							name="tls"
							{...useState(this, 'formValues.tls', 'checked')}
							disabled={lockNetwork}
						/>
						Enable TLS/SSL
					</label>
				</div>
				<div className="clearfix"></div>
			</div>
		);
	}

	render () {
		const lockNetwork = false;
		const displayNetwork = true;
		const isPublic = false;

		return (
			<div id="connect" className="window cmpt-connect-window">
				<div className="header">
					<button className="lt" aria-label="Toggle channel list"></button>
				</div>
				<form className="container">
					<div className="row">
						<div className="col-sm-12">
							<h1 className="title">
								{ isPublic ? 'The Lounge - ' : null }
								Connect
								{ !displayNetwork && lockNetwork
									? 'to ' + this.state.network.name
									: null }
							</h1>
						</div>
						{ displayNetwork
							? this.renderNetworkSettings()
							: null
						}
						<div className="col-sm-12">
							<h2>User preferences</h2>
						</div>
						<div className="col-sm-3">
							<label htmlFor="connect:nick">Nick</label>
						</div>
						<div className="col-sm-9">
							<input
								id="connect:nick"
								className="input nick"
								{...useState(this, 'formValues.nick')}
							/>
						</div>
						<div className="col-sm-3">
							<label htmlFor="connect:username">Username</label>
						</div>
						<div className="col-sm-9">
							<input
								id="connect:username"
								className="input username"
								{...useState(this, 'formValues.username')}
							/>
						</div>
						<div className="col-sm-3">
							<label htmlFor="connect:realname">Real name</label>
						</div>
						<div className="col-sm-9">
							<input
								id="connect:realname"
								className="input"
								{...useState(this, 'formValues.realname')}
							/>
						</div>
						<div className="col-sm-3">
							<label htmlFor="connect:channels">Channels</label>
						</div>
						<div className="col-sm-9">
							<input
								id="connect:channels"
								className="input"
								{...useState(this, 'formValues.join')}
							/>
						</div>
						<div className="col-sm-9 col-sm-offset-3">
							<button
								className="btn"
								type="button"
								onClick={this.handleSubmit.bind(this)}
								disabled={this.state.submitting}
							>
								Connect
							</button>
						</div>
					</div>
				</form>
			</div>
		);
	}
}

ConnectWindow.propTypes = {
	// authState: PropTypes.string.isRequired,
};


const mapStateToProps = state => ({}); // eslint-disable-line
const mapDispatchToProps = dispatch => ({}); // eslint-disable-line

export default connect(mapStateToProps, mapDispatchToProps)(ConnectWindow);
