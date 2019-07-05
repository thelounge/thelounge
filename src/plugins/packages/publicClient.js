module.exports = class PublicClient {
	constructor(client) {
		this.client = client;
	}

	/**
	 *
	 * @param {String} command - IRC command to run, this is in the same format that a client would send to the server (eg: JOIN #test)
	 * @param {String} targetId - The id of the channel to simulate the command coming from. Replies will go to this channel if appropriate
	 */
	runAsUser(command, targetId) {
		this.client.inputLine({target: targetId, text: command});
	}

	/**
	 *
	 * @param {Object} attributes
	 */
	createChannel(attributes) {
		return this.client.createChannel(attributes);
	}

	/**
	 * Emits an `event` to the browser client, with `data` in the body of the event.
	 *
	 * @param {String} event - Name of the event, must be something the browser will recognise
	 * @param {Object} data - Body of the event, can be anything, but will need to be properly interpreted by the client
	 */
	sendToBrowser(event, data) {
		this.client.emit(event, data);
	}

	/**
	 *
	 * @param {Number} chanId
	 */
	getChannel(chanId) {
		return this.client.find(chanId);
	}
};
