import { getBarsStyle, type MainChartTheme } from './chart-colors';
import type { ChartData } from 'chart.js';
import type { ListenedDatas } from './util-chart-type';
import { getChartBar } from './util-chart-data-setter';
import { firstLetterToUpperCase } from '$lib/utils/Public/Helpers/displayHelpers';

export const emptyLine = { type: 'line', data: [] } satisfies ChartData['datasets'][0];

export function getChartData(
	{
		dateArray,
		transactionsIn,
		transactionsOut,
		estimatesKeptsIn,
		estimatesKeptsOut,
		commitsIn,
		commitsOut,
		hightLightIndex
	}: ListenedDatas,
	theme: MainChartTheme
) {
	const styles = getBarsStyle(theme);
	return {
		labels: dateArray.map((item) => firstLetterToUpperCase(item.format('MMM'))),
		datasets: [
			emptyLine,
			getChartBar(transactionsIn, hightLightIndex, 'in', 'Transactions', styles['transactionsIn']),
			getChartBar(
				transactionsOut,
				hightLightIndex,
				'out',
				'Transactions',
				styles['transactionsOut']
			),
			getChartBar(commitsIn, hightLightIndex, 'in', 'Engagés', styles['commitsIn']),
			getChartBar(commitsOut, hightLightIndex, 'out', 'Engagés', styles['commitsOut']),
			getChartBar(estimatesKeptsIn, hightLightIndex, 'in', 'Estimés', styles['estimatesIn']),
			getChartBar(estimatesKeptsOut, hightLightIndex, 'out', 'Estimés', styles['estimatesOut'])
		]
	} satisfies ChartData;
}
