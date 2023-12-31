// test/getMonthVariations.test.js
import { it, expect } from 'vitest';
import type { Dayjs, QUnitType } from 'dayjs';
import { getRangeFromDate, getSpanRangesToLoad } from '$lib/utils/Public/Helpers/dateRangeHelpers';
import dayjs from 'dayjs';
import type { DateRange } from '$lib/types/customTypes';

function stringifyDate(date: dayjs.Dayjs | undefined) {
	if (date) return date.format('YYYY-MM-DD');
}

it('Si le range initial est undefined, le start retourné devrait être une date antérieure ou égale à la date de départ de la span courante ', () => {
	let frequency = 'quarter' as QUnitType;
	let initialRange = undefined;
	let newRange = getRangeFromDate('2023-06-05', '2023-07-01');
	let resultRange = getSpanRangesToLoad({ initialRange, newRange, frequency });

	expect(stringifyDate(resultRange.ranges[0]?.start)).toBe('2023-04-01');
});

it('Le start et le end retournés doivent toujours prendre respectivement la date de début et la date de fin des spans dont ils font partie.', () => {
	let frequency = 'week' as QUnitType;
	let initialRange = undefined;
	let newRange = getRangeFromDate('2023-05-05', '2023-06-22');
	let resultRange = getSpanRangesToLoad({ initialRange, newRange, frequency });
	expect(resultRange.ranges.length).toBe(1);
	expect(stringifyDate(resultRange.ranges[0]?.start)).toBe('2023-05-01');
	expect(stringifyDate(resultRange.ranges[0]?.end)).toBe('2023-06-25');
});

it('En fréquence week, Si le range initial est undefined, le start retourné devrait être une date antérieure ou égale à la date de départ de la span courante ', () => {
	const frequency = 'week' as QUnitType;
	const initialRange = undefined;
	const newRange = getRangeFromDate('2023-06-01', '2023-07-01');
	const rangeToLoad = getSpanRangesToLoad({ initialRange, newRange, frequency });

	expect(stringifyDate(rangeToLoad.ranges[0]?.start)).toBe('2023-05-22');
});

it('En fréquence Month, Si le range initial est undefined, le end retourné devrait être une date antérieure ou égale à la date de départ de la span courante ', () => {
	const frequency = 'week' as QUnitType;
	const initialRange = undefined;
	const newRange = getRangeFromDate('2023-06-01', '2023-07-01');
	const rangeToLoad = getSpanRangesToLoad({ initialRange, newRange, frequency });

	expect(stringifyDate(rangeToLoad.ranges[0]?.start)).toBe('2023-05-22');
});

it('Sans range initial, le end retourné devrait correspondre au jour de fin de la dernière span inclue dans le range', () => {
	const frequency = 'quarter' as QUnitType;
	const initialRange = undefined;
	const newRange = getRangeFromDate('2023-06-01', '2023-07-01');
	const rangeToLoad = getSpanRangesToLoad({ initialRange, newRange, frequency });

	expect(stringifyDate(rangeToLoad.ranges[0]?.end)).toBe('2023-09-30');
});

it('Si initialRange et newRange donne les mêmes spans, on ne doit récupérer aucune span', () => {
	let frequency: QUnitType;
	let initialRange: DateRange | undefined;
	let newRange: DateRange;
	let resultRange: { ranges: DateRange[]; newInitialRange: DateRange };

	frequency = 'month' as QUnitType;
	initialRange = getRangeFromDate('2023-06-01', '2023-07-01');
	newRange = getRangeFromDate('2023-06-05', '2023-07-25');
	resultRange = getSpanRangesToLoad({ initialRange, newRange, frequency });
	expect(resultRange.ranges.length).toBe(0);

	frequency = 'quarter' as QUnitType;
	initialRange = getRangeFromDate('2023-05-30', '2023-08-01');
	newRange = getRangeFromDate('2023-04-05', '2023-09-25');
	resultRange = getSpanRangesToLoad({ initialRange, newRange, frequency });
	expect(resultRange.ranges.length).toBe(0);
});

it('Si newRange est plus grand de toutes parts que initialRange, on doit obtenir deux ranges complémentaires', () => {
	let frequency: QUnitType;
	let initialRange: DateRange | undefined;
	let newRange: DateRange;
	let resultRange: { ranges: DateRange[]; newInitialRange: DateRange };

	frequency = 'month' as QUnitType;
	initialRange = getRangeFromDate('2023-05-01', '2023-05-31');
	newRange = getRangeFromDate('2023-01-05', '2023-09-25');
	resultRange = getSpanRangesToLoad({ initialRange, newRange, frequency });
	expect(resultRange.ranges.length).toBe(2);
	expect(stringifyDate(resultRange.ranges[0]?.start)).toBe('2023-01-01');
	expect(stringifyDate(resultRange.ranges[0]?.end)).toBe('2023-04-30');
	expect(stringifyDate(resultRange.ranges[1]?.start)).toBe('2023-06-01');
	expect(stringifyDate(resultRange.ranges[1]?.end)).toBe('2023-09-30');
});

it('Test spontanné', () => {
	let frequency: QUnitType;
	let initialRange: DateRange | undefined;
	let newRange: DateRange;
	let resultRange: { ranges: DateRange[]; newInitialRange: DateRange };

	frequency = 'day' as QUnitType;
	initialRange = undefined;
	newRange = getRangeFromDate('2023-07-05', '2023-09-25');
	resultRange = getSpanRangesToLoad({ initialRange, newRange, frequency });
	expect(stringifyDate(resultRange.ranges[0]?.start)).toBe(dayjs().format('YYYY-MM-DD'));
});

it('Deuxième test spontanné', () => {
	let frequency: QUnitType;
	let initialRange: DateRange | undefined;
	let newRange: DateRange;
	let resultRange: { ranges: DateRange[]; newInitialRange: DateRange };

	frequency = 'day' as QUnitType;
	initialRange = getRangeFromDate('2023-08-05', '2023-09-02');
	newRange = getRangeFromDate('2023-07-05', '2023-09-25');
	resultRange = getSpanRangesToLoad({ initialRange, newRange, frequency });
	expect(resultRange.ranges.length).toBe(2);
	expect(stringifyDate(resultRange.ranges[0]?.start)).toBe('2023-07-05');
	expect(stringifyDate(resultRange.ranges[0]?.end)).toBe('2023-08-04');
	expect(stringifyDate(resultRange.ranges[1]?.start)).toBe('2023-09-03');
	expect(stringifyDate(resultRange.ranges[1]?.end)).toBe('2023-09-25');
	expect(stringifyDate(resultRange.newInitialRange.start)).toBe('2023-07-05');
	expect(stringifyDate(resultRange.newInitialRange.end)).toBe('2023-09-25');
});

it('Si newRange dépasse initialRange dans le futur, on renvoie newRange en excluant la partie initialRange', () => {
	let frequency: QUnitType;
	let initialRange: DateRange | undefined;
	let newRange: DateRange;
	let resultRange: { ranges: DateRange[]; newInitialRange: DateRange };

	frequency = 'month' as QUnitType;
	initialRange = getRangeFromDate('2023-05-01', '2023-07-31');
	newRange = getRangeFromDate('2023-07-05', '2023-09-25');
	resultRange = getSpanRangesToLoad({ initialRange, newRange, frequency });
	expect(resultRange.ranges.length).toBe(1);
	expect(stringifyDate(resultRange.ranges[0]?.start)).toBe('2023-08-01');
	expect(stringifyDate(resultRange.ranges[0]?.end)).toBe('2023-09-30');
	expect(stringifyDate(resultRange.newInitialRange.start)).toBe('2023-05-01');
	expect(stringifyDate(resultRange.newInitialRange.end)).toBe('2023-09-30');
});

it('Si newRange dépasse initialRange dans le passé, on renvoie newRange en excluant la partie initialRange', () => {
	let frequency: QUnitType;
	let initialRange: DateRange | undefined;
	let newRange: DateRange;
	let resultRange: { ranges: DateRange[]; newInitialRange: DateRange };

	frequency = 'month' as QUnitType;
	initialRange = getRangeFromDate('2023-05-01', '2023-07-31');
	newRange = getRangeFromDate('2023-01-05', '2023-07-05');
	resultRange = getSpanRangesToLoad({ initialRange, newRange, frequency });
	expect(resultRange.ranges.length).toBe(1);
	expect(stringifyDate(resultRange.ranges[0]?.start)).toBe('2023-01-01');
	expect(stringifyDate(resultRange.ranges[0]?.end)).toBe('2023-04-30');
	expect(stringifyDate(resultRange.newInitialRange.start)).toBe('2023-01-01');
	expect(stringifyDate(resultRange.newInitialRange.end)).toBe('2023-07-31');

	frequency = 'month' as QUnitType;
	initialRange = getRangeFromDate('2023-05-01', '2023-07-31');
	newRange = getRangeFromDate('2023-01-05', '2023-03-02');
	resultRange = getSpanRangesToLoad({ initialRange, newRange, frequency });
	expect(resultRange.ranges.length).toBe(1);
	expect(stringifyDate(resultRange.ranges[0]?.start)).toBe('2023-01-01');
	expect(stringifyDate(resultRange.ranges[0]?.end)).toBe('2023-04-30');
	expect(stringifyDate(resultRange.newInitialRange.start)).toBe('2023-01-01');
	expect(stringifyDate(resultRange.newInitialRange.end)).toBe('2023-07-31');
});

// it('Le start retourné doit correspondre au début de la span suivant la dernière span inclue dans le précédent range', () => {
// 	let frequency: QUnitType;
// 	let initialRange: DateRange | undefined;
// 	let newRange: DateRange;
// 	let resultRange: { ranges: DateRange[]; newInitialRange: DateRange };

// 	frequency = 'month' as QUnitType;
// 	initialRange = getRangeFromDate('2023-06-01', '2023-06-30');
// 	newRange = getRangeFromDate('2023-06-05', '2023-07-31');
// 	resultRange = getSpanRangesToLoad({ initialRange, newRange, frequency });
// 	expect(stringifyDate(resultRange?.start)).toBe('2023-09-39');

// 	frequency = 'quarter' as QUnitType;
// 	initialRange = undefined;
// 	newRange = getRangeFromDate('2023-06-01', '2023-07-01');
// 	resultRange = getSpanRangesToLoad({ initialRange, newRange, frequency });
// 	expect(stringifyDate(resultRange?.start)).toBe('2023-09-30');
// });
