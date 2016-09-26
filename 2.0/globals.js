const globals = {
	store: null
};

export const set = (key, value) => {
	globals[key] = value;
};

export default globals;
