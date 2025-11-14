type PrefixSymbol = string;

type PrefixObject = {
	symbol: PrefixSymbol;
	mode: string;
};

class Prefix {
	prefix: PrefixObject[];
	modeToSymbol: {[mode: string]: string};
	symbols: string[];

	constructor(prefix: PrefixObject[]) {
		this.prefix = prefix || []; // [{symbol: "@", mode: "o"}, ... ]
		this.modeToSymbol = {};
		this.symbols = [];
		this._update_internals();
	}

	_update_internals() {
		// clean out the old cruft
		this.modeToSymbol = {};
		this.symbols = [];

		this.prefix.forEach((p) => {
			this.modeToSymbol[p.mode] = p.symbol;
			this.symbols.push(p.symbol);
		});
	}

	update(prefix: PrefixObject[]) {
		this.prefix = prefix || [];
		this._update_internals();
	}

	forEach(f: (value: PrefixObject, index: number, array: PrefixObject[]) => void) {
		return this.prefix.forEach(f);
	}
}

export default Prefix;
