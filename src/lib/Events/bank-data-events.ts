//--------  Declare new events here   -----------------------

import type { limitMessageKey } from '$lib/components/App-Limits/util-limit';

type CustomEventDetail = {
	AddManualAccount: undefined;
	OverLimit: limitMessageKey;
};

//------------------------------------------------------------

type CustomEventName = keyof CustomEventDetail;

export namespace EventBankData {
	export function dispatch<T extends CustomEventName>(name: T, detail: CustomEventDetail[T]) {
		try {
			const event = new CustomEvent(name, { detail });
			document.dispatchEvent(event);
		} catch (err) {}
	}

	export function listen(name: CustomEventName, listener: EventListenerOrEventListenerObject) {
		try {
			document.addEventListener(name, listener);
			return () => document.removeEventListener(name, listener);
		} catch (err) {}
	}

	export function remove(name: CustomEventName, listener: EventListenerOrEventListenerObject) {
		try {
			document.removeEventListener(name, listener);
		} catch (err) {}
	}

	export function getDetails<T extends CustomEventName>(event: Event | CustomEvent, name: T) {
		return (event as CustomEvent).detail as CustomEventDetail[T];
	}
}
