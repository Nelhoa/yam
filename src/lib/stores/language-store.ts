import { writable } from 'svelte/store';

export const langage = writable<{ intl: string; dayjs: string; chartjs: string }>({
	intl: 'fr',
	dayjs: 'fr',
	chartjs: 'FR'
});
