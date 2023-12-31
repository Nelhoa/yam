<script lang="ts">
	import type { Span } from '$lib/models/spans/span';
	import { onMount } from 'svelte';
	import { Chart, registerables } from 'chart.js';
	import annotationPlugin from 'chartjs-plugin-annotation';
	import _ from 'lodash';
	import { CategoriesChart } from './categories-chart';
	import { dark, light } from '../Chart-Main/chart-colors';
	const theme = light;
	Chart.register(...registerables, annotationPlugin);

	export let span: Span;
	const cellsMap = span.cellsMap;
	const categoriesArray = _.orderBy(
		[...$cellsMap].filter(([key]) => ['income', 'outcome'].includes(key.type)),
		([key, value]) => value.impact,
		'desc'
	).sort(([keyA], [keyB]) => {
		if (keyA.type === 'income') return -1;
		return 1;
	});
	let firstOutcomeIndex: number = 0;
	for (const [key] of categoriesArray) {
		if (key.type === 'outcome') break;
		firstOutcomeIndex++;
	}
	console.log({ firstOutcomeIndex });
	let chartElement: HTMLCanvasElement;
	let chart: CategoriesChart;

	onMount(() => {
		chart = new CategoriesChart(
			chartElement,
			span,
			span.parentOrganisation,
			theme,
			categoriesArray,
			firstOutcomeIndex
		);
	});
</script>

<div style="height: {50 + categoriesArray.length * 26}px;">
	<canvas bind:this={chartElement} />
</div>
