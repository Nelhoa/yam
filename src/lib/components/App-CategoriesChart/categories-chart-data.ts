import type { ChartData, ScriptableContext } from 'chart.js';
import { getBarsStyle, type MainChartTheme } from '../Chart-Main/chart-colors';

export function getChartData(
	categoryNames: string[],
	transactions: number[],
	estimatesImpact: number[],
	commits: number[],
	firstOutcomeIndex: number,
	theme: MainChartTheme
) {
	const style = getBarsStyle(theme);
	return {
		labels: categoryNames,
		datasets: [
			{
				label: 'Transactions',
				data: transactions,
				backgroundColor: setColor(
					firstOutcomeIndex,
					style.transactionsOut.colorHover,
					style.transactionsIn.colorHover
				),
				borderWidth: 0,
				type: 'bar',
				stack: 'a'
			},
			{
				label: 'Engagés',
				data: commits,
				backgroundColor: setColor(
					firstOutcomeIndex,
					style.commitsOut.colorHover,
					style.commitsIn.colorHover
				),
				borderWidth: 0,
				type: 'bar',
				stack: 'a'
			},
			{
				label: 'Restes Estimés',
				data: estimatesImpact,
				backgroundColor: setColor(
					firstOutcomeIndex,
					style.estimatesOut.colorHover,
					style.estimatesIn.colorHover
				),
				borderWidth: 0,
				type: 'bar',
				stack: 'a'
			}
		]
	} satisfies ChartData;
}

export function setColor(firstOutcomeIndex: number, firstColor: any, secondColor: any) {
	return (ctx: ScriptableContext<'bar'>) => {
		if (ctx.dataIndex >= firstOutcomeIndex) return firstColor;
		return secondColor;
	};
}
