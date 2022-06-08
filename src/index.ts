import * as dns from "dns";

// Set DNS result order early before anything that may depend on it happens.
if (dns.setDefaultResultOrder) {
	dns.setDefaultResultOrder("verbatim");
}

import "./command-line";
