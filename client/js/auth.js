"use strict";

import storage from "./localStorage";
import location from "./location";

export default class Auth {
	static signout() {
		storage.clear();
		location.reload();
	}
}
