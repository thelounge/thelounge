"use strict";
import socket from "../socket";
import Auth from "../auth";
socket.on("sign-out", function () {
	Auth.signout();
});
//# sourceMappingURL=sign_out.js.map
