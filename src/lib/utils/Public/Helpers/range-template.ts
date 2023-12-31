import type { DateRange } from '$lib/types/customTypes';
import dayjs from 'dayjs';
import { langage } from '$lib/stores/language-store';
import 'dayjs/locale/fr';
import { get } from 'svelte/store';

try {
	console.log(get(langage).dayjs);
} catch (err) {
	console.error(err);
}

type rangeTemplate = {
	[key: string]: DateRange;
};

export const rangeTemplates = {
	twentyYears: {
		start: dayjs().subtract(10, 'year').startOf('year'),
		end: dayjs().add(10, 'year').endOf('year')
	},
	sixMonths: {
		start: dayjs().subtract(5, 'month'),
		end: dayjs().add(1, 'month')
	},
	OneYear: {
		start: dayjs().subtract(6, 'month'),
		end: dayjs().add(6, 'month')
	},
	default: {
		start: dayjs().subtract(6, 'months').startOf('month'),
		end: dayjs().add(2, 'months').startOf('month')
	},
	thisYear: {
		start: dayjs().startOf('year'),
		end: dayjs().endOf('year').startOf('month')
	}
} satisfies rangeTemplate;
