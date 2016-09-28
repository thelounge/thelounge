import _ from 'lodash';


export const getValue = (element) => {
	const type = element.type;
	if (type === 'checkbox') {
		return element.checked;
	} else if (type === 'number') {
		return element.valueAsNumber;
	}
	return element.value;
};


/** Hacky little method to update our state object */
export const onChange = (self, breadcrumb, event) => {
	const value = getValue(event.target);
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
