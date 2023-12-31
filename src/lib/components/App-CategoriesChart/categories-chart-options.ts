import type { ChartOptions } from 'chart.js';
import { get } from 'svelte/store';
import { langage } from '$lib/stores/language-store';
import type { MainChartTheme } from '../Chart-Main/chart-colors';

export function getChartOptions(theme: MainChartTheme) {
	return {
		indexAxis: 'y',
		locale: get(langage).chartjs,
		datasets: {
			bar: {
				minBarLength: 0
			}
		},
		interaction: {
			mode: 'index',
			axis: 'y',
			intersect: false
		},
		maintainAspectRatio: false,
		responsive: true,
		plugins: {
			legend: {
				display: false
			},
			tooltip: {
				enabled: true
			}
		},
		scales: {
			x: {
				grid: {
					color: theme.yGridLines,
					lineWidth: 1,
					display: true
				},
				suggestedMax: 1000,
				ticks: { color: theme.yGridLabels, font: { size: 13 }, maxTicksLimit: 7 }
			},
			y: {
				stacked: true,
				beginAtZero: false,
				ticks: { color: 'black', font: { size: 14 } },
				grid: {
					color: theme.yGridLines,
					lineWidth: 0
				}
			}
		}
	} satisfies ChartOptions;
}
