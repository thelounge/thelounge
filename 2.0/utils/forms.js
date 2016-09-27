import _ from 'lodash';


/** Hacky little method to update our state object */
export const onChange = (self, breadcrumb, event) => {
	const type = event.target.type;
	let value;

	if (type === 'checkbox') {
		value = event.target.checked;
	} else if (type === 'number') {
		value = event.target.valueAsNumber;
	} else {
		value = event.target.value;
	}

	// We need to manually deep merge, since react doesnt
	const newState = _.extend({}, self.state);
	_.set(newState, breadcrumb, value);
	self.setState(newState);
};


export const useState = (self, breadcrumb, valueAttr = 'value') => {
	return {
		[valueAttr]: _.get(self.state, breadcrumb),
		onChange: onChange.bind(null, self, breadcrumb)
	};
};
