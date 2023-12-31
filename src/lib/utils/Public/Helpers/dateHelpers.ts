import type { DateRange } from '$lib/types/customTypes';
import type { QUnitType } from 'dayjs';
import dayjs from 'dayjs';

export type dayjsDate = string | number | dayjs.Dayjs | Date | null | undefined;
export type dayjsDateRange = { start: dayjsDate; end: dayjsDate };

export function comparedDate(date: dayjsDate) {
	return new compared_Date(date);
}

export function comparedRange(range: dayjsDateRange) {
	return new compared_Range(range);
}

class compared_Range {
	range: dayjsDateRange;
	constructor(range: dayjsDateRange) {
		this.range = range;
	}

	isInRange(referenceRange: dayjsDateRange, unit?: QUnitType) {
		return isRangeInRange(this.range, referenceRange, unit);
	}
}

class compared_Date {
	date: dayjsDate;
	constructor(date: dayjsDate) {
		this.date = date;
	}
	isSameOrAfter(referenceDate: dayjsDate, unit?: QUnitType) {
		return isDateSameOrAfter(this.date, referenceDate, unit);
	}
	isSameOrBefore(referenceDate: dayjsDate, unit?: QUnitType) {
		return isDateSameOrBefore(this.date, referenceDate, unit);
	}
	isInRange(referenceRange: dayjsDateRange, unit?: QUnitType) {
		return isDateInRange(this.date, referenceRange, unit);
	}
}

function isDateSameOrAfter(date: dayjsDate, referenceDate: dayjsDate, unit?: QUnitType): boolean {
	date = dayjs(date);
	return date.isAfter(referenceDate, unit) || date.isSame(referenceDate, unit);
}

function isDateSameOrBefore(date: dayjsDate, referenceDate: dayjsDate, unit?: QUnitType): boolean {
	date = dayjs(date);
	return date.isBefore(referenceDate, unit) || date.isSame(referenceDate, unit);
}

function isDateInRange(date: dayjsDate, { start, end }: dayjsDateRange, unit?: QUnitType): boolean {
	return isDateSameOrAfter(date, start, unit) && isDateSameOrBefore(date, end, unit);
}

function isRangeInRange(
	range: dayjsDateRange,
	referenceRange: dayjsDateRange,
	unit?: QUnitType
): boolean {
	return (
		isDateInRange(range.start, referenceRange, unit) &&
		isDateInRange(range.end, referenceRange, unit)
	);
}

export function getDatesInRange(range: DateRange, frequency: QUnitType) {
	const { start, end } = range;
	let currentDate = start.startOf(frequency);
	let dates: string[] = [];
	while (comparedDate(currentDate).isSameOrBefore(end)) {
		dates.push(currentDate.format('YYYY-MM-DD'));
		currentDate = currentDate.add(1, frequency);
	}
	return dates;
}
