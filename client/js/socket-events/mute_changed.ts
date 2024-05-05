import socket from "../socket";
import {store} from "../store";
import {ChanType} from "../../../shared/types/chan";

socket.on("mute:changed", (response) => {
	const {target, status} = response;

	const netChan = store.getters.findChannel(target);

	if (netChan?.channel.type === ChanType.LOBBY) {
		for (const chan of netChan.network.channels) {
			if (chan.type !== ChanType.SPECIAL) {
				chan.muted = status;
			}
		}
	} else if (netChan) {
		netChan.channel.muted = status;
	}
});
