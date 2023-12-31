import type { ChartOptions } from 'chart.js';
import type { MainChartTheme } from './chart-colors';
import { get } from 'svelte/store';
import { langage } from '$lib/stores/language-store';
import type { AnnotationOptions } from 'chartjs-plugin-annotation';
import tinycolor from 'tinycolor2';

export const highLighter: AnnotationOptions<'box'> = {
	type: 'box',
	xMin: -0.5,
	xMax: 0.5,
	yMin: 'min',
	yMax: 'max',
	backgroundColor: tinycolor('#009CFF').setAlpha(0.05).toRgbString(),
	borderColor: 'transparent',
	display: true,
	drawTime: 'beforeDatasetsDraw'
};

export function getChartOptions(spanSelect: Function, theme: MainChartTheme) {
	return {
		onClick: (event, elements) => {
			if (elements.length > 0) {
				const elementClickedOnChart = elements[0];
				spanSelect(elementClickedOnChart);
			}
		},
		locale: get(langage).chartjs,
		datasets: {
			bar: {
				minBarLength: 0
			}
		},
		interaction: {
			mode: 'index',
			axis: 'x',
			intersect: false
		},
		maintainAspectRatio: false,
		responsive: true,
		plugins: {
			annotation: {
				annotations: [highLighter]
			},
			legend: {
				display: false
			},
			tooltip: {
				enabled: false
			}
		},
		scales: {
			x: {
				grid: {
					color: theme.xGridLines,
					lineWidth: 1,
					display: false
				},
				ticks: {
					display: false,
					color: theme.xGridLabels,
					font: { size: 11.5, family: 'arial', weight: '600' }
				}
			},

			y: {
				beginAtZero: false,
				suggestedMax: 1000,
				ticks: { display: false, color: theme.yGridLabels, font: { size: 13 }, maxTicksLimit: 6 },
				grid: {
					color: theme.yGridLines,
					lineWidth: 0.8
				}
			}
		}
	} satisfies ChartOptions;
}
