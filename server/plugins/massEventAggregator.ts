import Msg from "../models/msg.js";
import Chan from "../models/chan.js";
import Client from "../client.js";
import Network from "../models/network.js";
import Config from "../config.js";
import log from "../log.js";
import {MessageType, MassEventSummary} from "../../shared/types/msg.js";
import {condensedTypes} from "../../shared/irc.js";

interface BufferedMessage {
	msg: Msg;
	timestamp: number;
}

interface ChannelMassEventState {
	isActive: boolean;
	buffer: BufferedMessage[];
	preBuffer: BufferedMessage[]; // Messages before activation (for accurate counting)
	startTime: number | null;
	cooldownTimer: ReturnType<typeof setTimeout> | null;
	maxDurationTimer: ReturnType<typeof setTimeout> | null;
	recentTimestamps: number[];
}

class MassEventAggregator {
	private channelStates: Map<number, ChannelMassEventState> = new Map();
	private client: Client;

	constructor(client: Client) {
		this.client = client;
	}

	private getOrCreateState(chanId: number): ChannelMassEventState {
		if (!this.channelStates.has(chanId)) {
			this.channelStates.set(chanId, {
				isActive: false,
				buffer: [],
				preBuffer: [],
				startTime: null,
				cooldownTimer: null,
				maxDurationTimer: null,
				recentTimestamps: [],
			});
		}

		return this.channelStates.get(chanId)!;
	}

	/**
	 * Process an incoming status message.
	 * Returns true if the message was buffered (mass event active).
	 * Returns false if the message should be sent normally.
	 */
	processMessage(
		network: Network,
		chan: Chan,
		msg: Msg,
		userUpdateCallback?: () => void
	): boolean {
		// Check if mass event detection is enabled
		if (!Config.values.massEventDetection?.enable) {
			log.debug("MassEvent: disabled in config");
			return false;
		}

		// Only process condensable message types
		if (!condensedTypes.has(msg.type)) {
			log.debug(`MassEvent: msg.type ${msg.type} not in condensedTypes`);
			return false;
		}

		// Never buffer self messages or highlights
		if (msg.self || msg.highlight) {
			return false;
		}

		const config = Config.values.massEventDetection;
		const state = this.getOrCreateState(chan.id);
		const now = Date.now();

		// Update recent timestamps (sliding window)
		state.recentTimestamps.push(now);
		const windowStart = now - config.windowMs;
		state.recentTimestamps = state.recentTimestamps.filter((t) => t > windowStart);

		log.debug(
			`MassEvent: chan=${chan.name} type=${msg.type} recentCount=${state.recentTimestamps.length} threshold=${config.threshold} isActive=${state.isActive}`
		);

		// Check if we should activate mass event mode
		if (!state.isActive) {
			// Track message in preBuffer for accurate counting when activation happens
			state.preBuffer.push({msg, timestamp: now});

			// Clean old messages from preBuffer (keep only within window)
			state.preBuffer = state.preBuffer.filter((m) => m.timestamp > windowStart);

			if (state.recentTimestamps.length >= config.threshold) {
				log.info(`MassEvent: ACTIVATING for ${chan.name} (${state.recentTimestamps.length} msgs, ${state.preBuffer.length} in preBuffer)`);

				// Move preBuffer to main buffer when activating
				state.buffer = [...state.preBuffer];
				state.preBuffer = [];

				this.activateMassEvent(state, chan, network, now);

				// Execute user update callback
				if (userUpdateCallback) {
					userUpdateCallback();
				}

				// Reset cooldown timer
				this.resetCooldownTimer(state, chan, network);

				return true; // Message was captured in preBuffer, now in main buffer
			} else {
				return false; // Not in mass event mode, process normally
			}
		}

		// We're in mass event mode - buffer the message
		state.buffer.push({msg, timestamp: now});

		// Execute user update callback (for real-time user list updates)
		if (userUpdateCallback) {
			userUpdateCallback();
		}

		// Reset cooldown timer
		this.resetCooldownTimer(state, chan, network);

		return true;
	}

	private activateMassEvent(
		state: ChannelMassEventState,
		chan: Chan,
		network: Network,
		now: number
	): void {
		state.isActive = true;
		state.startTime = now;

		const config = Config.values.massEventDetection;

		// Set maximum duration timer
		state.maxDurationTimer = setTimeout(() => {
			this.endMassEvent(state, chan, network);
		}, config.maxDurationMs);
	}

	private resetCooldownTimer(
		state: ChannelMassEventState,
		chan: Chan,
		network: Network
	): void {
		if (state.cooldownTimer) {
			clearTimeout(state.cooldownTimer);
		}

		const config = Config.values.massEventDetection;

		state.cooldownTimer = setTimeout(() => {
			this.endMassEvent(state, chan, network);
		}, config.cooldownMs);
	}

	private endMassEvent(
		state: ChannelMassEventState,
		chan: Chan,
		network: Network
	): void {
		if (!state.isActive) {
			return;
		}

		log.info(`MassEvent: ENDING for ${chan.name} (${state.buffer.length} buffered msgs)`);

		// Clear timers
		if (state.cooldownTimer) {
			clearTimeout(state.cooldownTimer);
			state.cooldownTimer = null;
		}

		if (state.maxDurationTimer) {
			clearTimeout(state.maxDurationTimer);
			state.maxDurationTimer = null;
		}

		// Generate summary
		const summary = this.generateSummary(state);
		log.info(`MassEvent: Summary - joins=${summary.joins} parts=${summary.parts} quits=${summary.quits}`);

		// Create summary message
		const summaryMsg = new Msg({
			type: MessageType.MASS_EVENT,
			time: new Date(),
			massEventSummary: summary,
		});

		// Push summary message through normal channel
		chan.pushMessage(this.client, summaryMsg);

		// Reset state
		state.isActive = false;
		state.buffer = [];
		state.preBuffer = [];
		state.startTime = null;
		state.recentTimestamps = [];

		// Refresh user list if configured
		if (Config.values.massEventDetection.refreshNamesAfter && network.irc) {
			network.irc.raw("NAMES", chan.name);
		}
	}

	private generateSummary(state: ChannelMassEventState): MassEventSummary {
		const now = Date.now();
		const summary: MassEventSummary = {
			joins: 0,
			parts: 0,
			quits: 0,
			modes: 0,
			nicks: 0,
			kicks: 0,
			chghosts: 0,
			away: 0,
			back: 0,
			duration: now - (state.startTime || now),
			startTime: new Date(state.startTime || now),
			endTime: new Date(),
		};

		for (const {msg} of state.buffer) {
			switch (msg.type) {
				case MessageType.JOIN:
					summary.joins++;
					break;
				case MessageType.PART:
					summary.parts++;
					break;
				case MessageType.QUIT:
					summary.quits++;
					break;
				case MessageType.MODE:
					// Count individual mode changes
					const modeText = msg.text || "";
					const modeChanges = modeText
						.split(" ")[0]
						.split("")
						.filter((c) => c !== "+" && c !== "-").length;
					summary.modes += modeChanges || 1;
					break;
				case MessageType.NICK:
					summary.nicks++;
					break;
				case MessageType.KICK:
					summary.kicks++;
					break;
				case MessageType.CHGHOST:
					summary.chghosts++;
					break;
				case MessageType.AWAY:
					summary.away++;
					break;
				case MessageType.BACK:
					summary.back++;
					break;
			}
		}

		return summary;
	}

	/**
	 * Clean up state for a channel (e.g., when leaving)
	 */
	cleanup(chanId: number): void {
		const state = this.channelStates.get(chanId);

		if (state) {
			if (state.cooldownTimer) {
				clearTimeout(state.cooldownTimer);
			}

			if (state.maxDurationTimer) {
				clearTimeout(state.maxDurationTimer);
			}

			this.channelStates.delete(chanId);
		}
	}

	/**
	 * Check if mass event is active for a channel
	 */
	isActive(chanId: number): boolean {
		return this.channelStates.get(chanId)?.isActive || false;
	}
}

export default MassEventAggregator;
