import { writable } from 'svelte/store';

export const formulasLoadingStore = writable<boolean>(false);
