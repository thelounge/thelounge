import {PluginInputHandler} from "./index";
import Msg from "../../models/msg";
import {ChanType, SpecialChanType} from "../../../shared/types/chan";
import {MessageType} from "../../../shared/types/msg";

const commands = ["ignorelist"];

const input: PluginInputHandler = function (this: any, network, chan) {

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
	newChan!.data = ignored;

	this.emit("msg:special", {
		chan: newChan!.id,
		data: ignored,
	});
};

export default {
	commands,
	input,
};
