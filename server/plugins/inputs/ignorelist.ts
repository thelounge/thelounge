import {PluginInputHandler} from "./index.js";
import Client from "../../client.js";
import Msg from "../../models/msg.js";
import {ChanType, SpecialChanType} from "../../../shared/types/chan.js";
import {MessageType} from "../../../shared/types/msg.js";

const commands = ["ignorelist"];

const input: PluginInputHandler = function (this: Client, network, chan) {
	if (network.ignoreList.length === 0) {
		chan.pushMessage(
			this,
			new Msg({
				type: MessageType.ERROR,
				text: "Ignorelist is empty",
			})
		);
		return;
	}

	const chanName = "Ignored users";
	const ignored = network.ignoreList.map((data) => ({
		hostmask: `${data.nick}!${data.ident}@${data.hostname}`,
		when: data.when,
	}));
	let newChan = network.getChannel(chanName);

	if (typeof newChan === "undefined") {
		newChan = this.createChannel({
			type: ChanType.SPECIAL,
			special: SpecialChanType.IGNORELIST,
			name: chanName,
			data: ignored,
		});
		this.emit("join", {
			network: network.uuid,
			chan: newChan!.getFilteredClone(true),
			shouldOpen: false,
			index: network.addChannel(newChan!),
		});
		return;
	}

	// TODO: add type for this chan/event
	newChan.data = ignored;

	this.emit("msg:special", {
		chan: newChan.id,
		data: ignored,
	});
};

export default {
	commands,
	input,
};
