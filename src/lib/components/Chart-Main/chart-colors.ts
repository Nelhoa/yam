import { draw } from 'patternomaly';
import { chartIndex } from './util-chart-type';
import tinycolor from 'tinycolor2';

export type MainChartTheme = typeof light;

export const light = {
	newYearGradient: 'rgba(0, 156, 255, 0.08)',
	pointBackground: 'rgba(0, 156, 255, 1)',
	pointBackgroundHover: '#009CFF',
	incomes: 'rgba(122, 220, 158, 0.50)',
	incomesHover: 'rgba(122, 220, 158, 0.85)',
	incomesSelected: 'rgba(122, 220, 158, 1)',
	incomesSelectedHover: 'rgba(122, 220, 158, 1)',
	outcomes: 'rgba(255,0,20,0.50)',
	outcomesHover: 'rgba(255,0,20,0.85)',
	outcomesSelected: 'rgba(255,0,20,1)',
	outcomesSelectedHover: 'rgba(255,0,20,1)',
	thisMonthBox: 'rgba(0, 156, 255, 0.08)',
	thisMonthLabelContent: 'white',
	thisMonthLabelBackground: 'rgba(0, 156, 255, 0.6)',
	xGridLines: 'rgba(0, 0, 0, 0)',
	xGridLabels: 'rgba(0, 0, 0, 0.6)',
	yGridLines: 'rgba(0,0, 0, 0.06)',
	yGridLabels: 'rgba(0,0, 0, .5)',
	chartAxisBorder: 'rgba(0,0,0,0)'
};

export const dark: MainChartTheme = {
	newYearGradient: 'rgba(0, 156, 255, 0.4)',
	pointBackground: 'rgba(0, 156, 255, 0.50)',
	pointBackgroundHover: '#009CFF',
	incomes: 'rgba(122, 220, 158, 0.15)',
	incomesHover: 'rgba(122, 220, 158, 0.5)',
	incomesSelected: 'rgba(122, 220, 158, 1)',
	incomesSelectedHover: 'rgba(122, 220, 158, 1)',
	outcomes: 'rgba(255,0,20,0.12)',
	outcomesHover: 'rgba(255,0,20,0.45)',
	outcomesSelected: 'rgba(255,0,20,1)',
	outcomesSelectedHover: 'rgba(255,0,20,1)',
	thisMonthBox: 'rgba(0, 156, 255, 0.06)',
	thisMonthLabelContent: 'white',
	thisMonthLabelBackground: 'rgba(0, 156, 255, 0.6)',
	xGridLines: 'rgba(255,255,255,.05)',
	xGridLabels: 'rgba(255,255,255,1)',
	yGridLines: 'rgba(255,255,255,.05)',
	yGridLabels: 'rgba(255,255,255,.5)',
	chartAxisBorder: 'rgba(255,255,255,.1)'
};

export type barKey =
	| 'transactionsIn'
	| 'transactionsOut'
	| 'estimatesIn'
	| 'estimatesOut'
	| 'commitsIn'
	| 'commitsOut';

export type DatasetStyle = {
	index: chartIndex;
	color: any;
	colorSelected: any;
	colorHover: any;
	colorSelectedHover: any;
};

export function getBarsStyle(theme: MainChartTheme) {
	return {
		transactionsIn: {
			index: chartIndex.TRANSACTION_IN,
			color: theme.incomes,
			colorSelected: theme.incomesSelected,
			colorHover: theme.incomesHover,
			colorSelectedHover: theme.incomesSelectedHover
		},
		transactionsOut: {
			index: chartIndex.TRANSACTION_OUT,
			color: theme.outcomes,
			colorSelected: theme.outcomesSelected,
			colorHover: theme.outcomesHover,
			colorSelectedHover: theme.outcomesSelectedHover
		},
		estimatesIn: {
			index: chartIndex.ESTIMATES_IN,
			color: estimatePatern(theme.incomes),
			colorSelected: estimatePatern(theme.incomesSelected),
			colorHover: estimatePatern(theme.incomesHover),
			colorSelectedHover: estimatePatern(theme.incomesSelectedHover)
		},
		estimatesOut: {
			index: chartIndex.ESTIMATES_OUT,
			color: estimatePatern(theme.outcomes),
			colorSelected: estimatePatern(theme.outcomesSelected),
			colorHover: estimatePatern(theme.outcomesHover),
			colorSelectedHover: estimatePatern(theme.outcomesSelectedHover)
		},
		commitsIn: {
			index: chartIndex.COMMITS_IN,
			color: commitsPatern(theme.incomes),
			colorSelected: commitsPatern(theme.incomesSelected),
			colorHover: commitsPatern(theme.incomesHover),
			colorSelectedHover: commitsPatern(theme.incomesSelectedHover)
		},
		commitsOut: {
			index: chartIndex.COMMITS_OUT,
			color: commitsPatern(theme.outcomes),
			colorSelected: commitsPatern(theme.outcomesSelected),
			colorHover: commitsPatern(theme.outcomesHover),
			colorSelectedHover: commitsPatern(theme.outcomesSelectedHover)
		}
	} satisfies { [key in barKey]: DatasetStyle };
}

export function estimatePatern(color: any) {
	const diagonalSize = 8;
	return draw('diagonal', 'transparent', color, diagonalSize);
}

export function commitsPatern(givenColor: any) {
	const color = tinycolor(givenColor);
	const alpha = color.getAlpha();
	return draw(
		'cross',
		color.setAlpha(alpha * 0.4).toPercentageRgbString(),
		color.setAlpha(alpha).toString(),
		10
	);
}
