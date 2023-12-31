import type { DateRange } from '$lib/types/customTypes';
import { rangeTemplates } from '$lib/utils/Public/Helpers/range-template';
import { writable } from 'svelte/store';

export const global_date_range = writable<DateRange>(rangeTemplates.OneYear);
