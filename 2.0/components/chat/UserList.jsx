import React, { PropTypes } from 'react';
import classNames from 'classnames';

const colorClass = (str) => {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash += str.charCodeAt(i);
	}
	return 'color-' + (1 + hash % 32);
};

const count = (count, singular, plural) => {
	return count + ' ' + (count === 1 ? singular : plural);
};


const MODES = {
	'~': 'owner',
	'&': 'admin',
	'!': 'admin',
	'@': 'op',
	'%': 'half-op',
	'+': 'voice',
	'': 'normal'
};


class UserList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			query: ''
		};
	}

	queryChange (e) {
		this.setState({ query: e.target.value });
	}

	shouldDisplayUser(user) {
		let query = this.state.query.trim().toLowerCase();
		return query.length === 0 || user.name.toLowerCase().indexOf(query) === 0;
	}

	shouldComponentUpdate(nextProps) {
		return this.props.users !== nextProps.users;
	}

	render() {
		let users = {};
		for (let user of this.props.users) {
			if (!(user.mode in users)) {
				users[user.mode] = [];
			}
			users[user.mode].push(
				<span
					key={user.name}
					role="button"
					className={classNames(
						'user',
						colorClass(user.name),
						this.shouldDisplayUser(user) ? '' : 'hidden'
					)}
					data-name={user.name}
				>
					{user.mode}{user.name}
				</span>
			);
		}

		return (
			<div>
				<div
					className={classNames(
						'count',
						this.props.users.length === 0 ? 'hidden' : ''
					)}
				>
					<input
						className="search"
						placeholder={count(this.props.users.length, 'user', 'users')}
						aria-label="Search among the user list"
						value={this.state.query}
						onChange={e => this.queryChange(e)}
					/>
				</div>
				<div className="names">
					{Object.keys(users).map(mode =>
						<div key={mode} className={classNames('user-mode', MODES[mode])}>
							{users[mode]}
						</div>
					)}
				</div>
			</div>
		);
	}
}


UserList.propTypes = {
	users: PropTypes.array.isRequired
};


export default UserList;
