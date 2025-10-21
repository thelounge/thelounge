import {IncomingMessage} from "http";

// Extend Socket.io Socket request to include Express Request properties after middleware processing
declare module "socket.io" {
	namespace Socket {
		interface Handshake {
			request: IncomingMessage & {
				session?: Express.Session;
				user?: Express.User;
			};
		}
	}
}

// Also extend the Socket.request directly for easier access
declare module "socket.io/dist/socket" {
	interface Socket {
		request: IncomingMessage & {
			session?: Express.Session;
			user?: Express.User;
		};
	}
}
