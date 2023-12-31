// test/getMonthVariations.test.js
import { it, expect } from 'vitest';
import dayjs from 'dayjs';
import { getMonthVariations } from '$lib/old-models/month-map-account';

const QontoTransactions = [
	{
		bank_account_uuid: '06a58295-5a73-4e2a-895e-cf89add696b5',
		month: '2022-10-01T00:00:00+00:00',
		incomes_number: 1,
		outcomes_number: 0,
		incomes_sum: 2000,
		outcomes_sum: null
	},
	{
		bank_account_uuid: '06a58295-5a73-4e2a-895e-cf89add696b5',
		month: '2022-11-01T00:00:00+00:00',
		incomes_number: 0,
		outcomes_number: 1,
		incomes_sum: null,
		outcomes_sum: 46.8
	},
	{
		bank_account_uuid: '06a58295-5a73-4e2a-895e-cf89add696b5',
		month: '2022-12-01T00:00:00+00:00',
		incomes_number: 0,
		outcomes_number: 3,
		incomes_sum: null,
		outcomes_sum: 293.81
	},
	{
		bank_account_uuid: '06a58295-5a73-4e2a-895e-cf89add696b5',
		month: '2023-01-01T00:00:00+00:00',
		incomes_number: 0,
		outcomes_number: 2,
		incomes_sum: null,
		outcomes_sum: 53.96
	},
	{
		bank_account_uuid: '06a58295-5a73-4e2a-895e-cf89add696b5',
		month: '2023-02-01T00:00:00+00:00',
		incomes_number: 0,
		outcomes_number: 1,
		incomes_sum: null,
		outcomes_sum: 46.8
	},
	{
		bank_account_uuid: '06a58295-5a73-4e2a-895e-cf89add696b5',
		month: '2023-03-01T00:00:00+00:00',
		incomes_number: 0,
		outcomes_number: 2,
		incomes_sum: null,
		outcomes_sum: 406.8
	},
	{
		bank_account_uuid: '06a58295-5a73-4e2a-895e-cf89add696b5',
		month: '2023-04-01T00:00:00+00:00',
		incomes_number: 0,
		outcomes_number: 1,
		incomes_sum: null,
		outcomes_sum: 46.8
	}
];

const realReferenceMonth = dayjs('2023.04.01');
const realReferenceAmount = 1151.83;

it('Reference month as compared month should return reference amount', () => {
	const referenceMonth = realReferenceMonth;
	const referenceAmount = realReferenceAmount;
	const comparedMonth = realReferenceMonth;

	expect(
		getMonthVariations(QontoTransactions, referenceAmount, referenceMonth, comparedMonth)
	).toBe(realReferenceAmount);
});

it(`The beginning of March should be equal to 1558.63`, () => {
	const referenceMonth = realReferenceMonth;
	const referenceAmount = realReferenceAmount;
	const comparedMonth = dayjs('2023-03-01');

	expect(
		getMonthVariations(QontoTransactions, referenceAmount, referenceMonth, comparedMonth)
	).toBeCloseTo(1558.63);
});

it(`The end of February should be equal to the beginning of March`, () => {
	const referenceMonth = realReferenceMonth;
	const referenceAmount = realReferenceAmount;

	const march = dayjs('2023-03-01');
	const febuary = dayjs('2023-02-01');
	const febuaryVariation = -46.8;

	const marchMonthStart = getMonthVariations(
		QontoTransactions,
		realReferenceAmount,
		realReferenceMonth,
		march
	);

	const febuaryMonthStart = getMonthVariations(
		QontoTransactions,
		realReferenceAmount,
		realReferenceMonth,
		febuary
	);

	const febuaryMonthEnd = febuaryMonthStart + febuaryVariation;
	expect(Math.round(febuaryMonthEnd)).toBeGreaterThan(marchMonthStart - 2);
	expect(Math.round(febuaryMonthEnd)).toBeLessThan(marchMonthStart + 2);
});

it('October should have a start value of 0', () => {
	const referenceMonth = realReferenceMonth;
	const referenceAmount = realReferenceAmount;
	const comparedMonth = dayjs('2022-10-01');

	expect(
		Math.round(
			getMonthVariations(QontoTransactions, referenceAmount, referenceMonth, comparedMonth)
		)
	).toBeGreaterThan(-1);
	expect(
		Math.round(
			getMonthVariations(QontoTransactions, referenceAmount, referenceMonth, comparedMonth)
		)
	).toBeLessThan(1);
});

it(`The beginning of May should be equal to the end of April`, () => {
	const referenceMonth = realReferenceMonth;
	const referenceAmount = realReferenceAmount;

	const may = dayjs('2023-05-01');
	const april = dayjs('2023-04-01');
	const aprilStats = QontoTransactions.find((monthStats) =>
		dayjs(monthStats.month).isSame(april, 'month')
	);
	const aprilEndOfMonth =
		realReferenceAmount + Number(aprilStats?.incomes_sum) - Number(aprilStats?.outcomes_sum);

	const mayStartOfMonth = getMonthVariations(
		QontoTransactions,
		realReferenceAmount,
		realReferenceMonth,
		may
	);

	expect(mayStartOfMonth).toBeCloseTo(aprilEndOfMonth);
});
