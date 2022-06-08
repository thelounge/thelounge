import io, {Socket} from "socket.io-client";
import type {ServerToClientEvents, ClientToServerEvents} from "../../server/types/socket-events";

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io({
	transports: JSON.parse(document.body.dataset.transports || "['polling', 'websocket']"),
	path: window.location.pathname + "socket.io/",
	autoConnect: false,
	reconnection: !document.body.classList.contains("public"),
});

// Ease debugging socket during development
if (process.env.NODE_ENV === "development") {
	window.socket = socket;
}

declare global {
	interface Window {
		socket: Socket;
	}
}

export default socket;
