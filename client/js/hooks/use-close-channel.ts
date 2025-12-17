import eventbus from "../eventbus";
import socket from "../socket";
import {ClientChan} from "../types";
import {ChanType} from "../../../shared/types/chan";

export default function useCloseChannel(channel: ClientChan) {
	return () => {
		if (channel.type === ChanType.LOBBY) {
			eventbus.emit(
				"confirm-dialog",
				{
					title: "Remove network",
					text: `Are you sure you want to quit and remove ${channel.name}? This cannot be undone.`,
					button: "Remove network",
				},
				(result: boolean) => {
					if (!result) {
						return;
					}

					channel.closed = true;
					socket.emit("input", {
						target: Number(channel.id),
						text: "/quit",
					});
				}
			);

			return;
		}

		channel.closed = true;

		console.log("[DEBUG] Closing channel:", channel.id, channel.name, channel.type);
		socket.emit("input", {
			target: Number(channel.id),
			text: "/close",
		});
	};
}
