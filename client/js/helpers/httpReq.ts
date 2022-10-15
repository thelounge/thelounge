// FOR JOTI API INTEGRATION

export default (
	nick: string,
	method = "GET",
	url: string,
	obj?: object,
	params?: object,
	cb?: (params: boolean, object) => void
) => {
	// URL encode query parameters
	if (params !== {}) {
		const encodedParams = new URLSearchParams();

		for (const k in params) {
			encodedParams.append(k, params[k]);
		}

		if (encodedParams.toString() !== "") {
			url += "?" + encodedParams.toString();
		}
	}

	// Build base request
	const req: RequestInit = {
		method: method,
		headers: {accept: "application/json", "IRC-Username": nick},
	};

	// Convert JSON body to string
	if (obj !== {} && method === "POST") {
		req.body = JSON.stringify(obj);
	}

	// Send request
	const request = new Request(url, req);

	// Await response
	fetch(request)
		.then((rsp) => rsp.json())
		.then((data) => {
			// eslint-disable-next-line no-console
			// console.log(data);

			if (cb) {
				cb(true, data);
			}
		})
		.catch((err) => {
			// eslint-disable-next-line no-console
			console.log(err);

			if (cb) {
				cb(false, err);
			}
		});
};
