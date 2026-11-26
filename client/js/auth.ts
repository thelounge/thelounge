import storage from "./localStorage";
import location from "./location";

export default class Auth {
	static signout() {
		storage.clear();

		try {
			// Holds unsent messages, see drafts.ts
			window.sessionStorage.clear();
		} catch (e) {
			//
		}

		location.reload();
	}
}
