import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import { getContext, setContext } from 'svelte';

export type AccordionOptions = { colapse: boolean };
export type ActiveId = string | null;
export type colapseContext = boolean;
export type ActiveIdContext = Writable<ActiveId>;

export function setAccordionOptions({ colapse }: AccordionOptions) {
	const activeComponentId = writable<ActiveId>(null);
	setContext<colapseContext>('colapse', colapse);
	setContext<ActiveIdContext>('active', activeComponentId);
}

export function getAccordionOptions() {
	const colapse = getContext<colapseContext>('colapse');
	const activeComponentId = getContext<ActiveIdContext>('active');
	return { colapse, activeComponentId };
}
