const events = new Map();

class EventBus {
	/**
	 * Register an event handler for the given type.
	 */
	on(type: string, handler: Function) {
		if (events.has(type)) {
			events.get(type).push(handler);
		} else {
			events.set(type, [handler]);
		}
	}

	/**
	 * Remove an event handler for the given type.
	 *
	 * @param  {String} type    Type of event to unregister `handler` from.
	 * @param  {Function} handler Handler function to remove.
	 */
	off(type: string, handler: Function) {
		if (events.has(type)) {
			events.set(
				type,
				events.get(type).filter((item: Function) => item !== handler)
			);
		}
	}

	/**
	 * Invoke all handlers for the given type.
	 *
	 * @param {String} type  The event type to invoke.
	 * @param {Any} [evt]  Any value (object is recommended and powerful), passed to each handler.
	 */
	emit(type: string, ...evt: any) {
		if (events.has(type)) {
			events
				.get(type)
				.slice()
				.map((handler: (...evt: any[]) => void) => {
					handler(...evt);
				});
		}
	}
}

export default new EventBus();
