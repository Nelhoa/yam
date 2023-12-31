import type { DateRange } from '$lib/types/customTypes';
import type { QUnitType } from 'dayjs';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import 'dayjs/locale/fr';
import dayjs from 'dayjs';
dayjs.locale('fr');
dayjs.extend(advancedFormat);
dayjs.extend(quarterOfYear);

interface SpanRangeParams {
	initialRange?: DateRange;
	newRange: DateRange;
	frequency: QUnitType;
}

interface SpanRangeResult {
	ranges: DateRange[];
	newLoadedRange: DateRange;
}

export function getSpanRangesToLoad({
	initialRange,
	newRange,
	frequency
}: SpanRangeParams): SpanRangeResult {
	if (!initialRange) {
		const currentSpanStart = dayjs().startOf(frequency);
		const newStart = newRange.start.isAfter(currentSpanStart) ? currentSpanStart : newRange.start;
		const updatedNewRange = {
			start: newStart.startOf(frequency),
			end: newRange.end.endOf(frequency)
		};
		return { ranges: [updatedNewRange], newLoadedRange: updatedNewRange };
	}

	const isSameStartSpan = initialRange.start.isSame(newRange.start, frequency);
	const isSameEndSpan = initialRange.end.isSame(newRange.end, frequency);
	const isStartSpanBeforeInitial = newRange.start.isBefore(initialRange.start, frequency);
	const isEndSpanAfterInitial = newRange.end.isAfter(initialRange.end, frequency);
	const isStartSpanAfterInitialStart = newRange.start.isAfter(initialRange.start, frequency);
	const isEndSpanBeforeInitialEnd = newRange.end.isBefore(initialRange.end, frequency);

	if (isSameEndSpan && isSameStartSpan) {
		return { ranges: [], newLoadedRange: initialRange };
	}

	if (isStartSpanBeforeInitial && isEndSpanAfterInitial) {
		const startRange = newRange.start.startOf(frequency);
		const endRange = newRange.end.endOf(frequency);
		const ranges = [
			{ start: startRange, end: initialRange.start.subtract(1, frequency).endOf(frequency) },
			{ end: endRange, start: initialRange.end.add(1, frequency).startOf(frequency) }
		];
		return { ranges, newLoadedRange: { start: startRange, end: endRange } };
	}

	if ((isStartSpanAfterInitialStart || isSameStartSpan) && isEndSpanAfterInitial) {
		const updatedStart = initialRange.end.add(1, frequency).startOf(frequency);
		const updatedEnd = newRange.end.endOf(frequency);
		const updatedRange = { start: updatedStart, end: updatedEnd };
		return {
			ranges: [updatedRange],
			newLoadedRange: { start: initialRange.start, end: updatedEnd }
		};
	}

	if ((isEndSpanBeforeInitialEnd || isSameEndSpan) && isStartSpanBeforeInitial) {
		const updatedStart = newRange.start.startOf(frequency);
		const updatedEnd = initialRange.start.subtract(1, frequency).endOf(frequency);
		const updatedRange = { start: updatedStart, end: updatedEnd };
		return {
			ranges: [updatedRange],
			newLoadedRange: { start: updatedStart, end: initialRange.end }
		};
	}
	return { ranges: [], newLoadedRange: initialRange };
}

export function printRange(range: DateRange) {
	return `[${range.start.format('Do MMM YY')} ::: ${range.end.format('Do MMM YY')}]`;
}

export function getRangeFromDate(start: string, end: string): DateRange {
	return { start: dayjs(start), end: dayjs(end) };
}
