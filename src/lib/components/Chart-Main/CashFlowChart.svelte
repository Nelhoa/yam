<script lang="ts">
	import { onMount } from 'svelte';
	import { Chart, registerables } from 'chart.js';
	import annotationPlugin from 'chartjs-plugin-annotation';
	import { light } from './chart-colors';
	import { getTodayTransitionIndex, handleMouseMove } from './util-chart-functions';
	import type { QUnitType } from 'dayjs';
	import type dayjs from 'dayjs';
	import _ from 'lodash';
	import { MainChart } from './main-chart';
	import { chartIndex, type ListenedDatas } from './util-chart-type';
	import { scenariosData } from './scenarios-data-store';
	import type { Organisation } from '$lib/models/structurals/organisation';
	import { get } from 'svelte/store';
	import Tooltip from './Tooltip.svelte';
	import { toolTipShow } from './chart-util-stores';
	const theme = light;
	Chart.defaults.borderColor = theme.chartAxisBorder;
	Chart.register(...registerables, annotationPlugin);

	export let dateArray: dayjs.Dayjs[];
	export let transactionsIn: number[];
	export let transactionsOut: number[];
	export let estimatesKeptsIn: number[];
	export let estimatesKeptsOut: number[];
	export let commitsIn: number[];
	export let commitsOut: number[];
	export let selectedDate: dayjs.Dayjs | null = null;
	export let frequency: QUnitType;
	export let organisation: Organisation;
	const { selectedSpan, selectedScenario } = organisation;

	let chartElement: HTMLCanvasElement;
	let chart: MainChart;
	let hightLightIndex = 0;
	const transitionIndex = getTodayTransitionIndex(dateArray, frequency);

	$: if (chart) chart.updateLabels(dateArray);
	$: if (chart) chart.select(selectedDate);
	$: if (chart) chart.updateViewedScenariosDataset($scenariosData);
	$: if (chart) chart.updateDataset(chartIndex.TRANSACTION_IN, transactionsIn);
	$: if (chart) chart.updateDataset(chartIndex.TRANSACTION_OUT, transactionsOut);
	$: if (chart) chart.updateDataset(chartIndex.ESTIMATES_IN, estimatesKeptsIn);
	$: if (chart) chart.updateDataset(chartIndex.ESTIMATES_OUT, estimatesKeptsOut);
	$: if (chart) chart.updateDataset(chartIndex.COMMITS_IN, commitsIn);
	$: if (chart) chart.updateDataset(chartIndex.COMMITS_OUT, commitsOut);

	let listenedData: ListenedDatas = {
		dateArray,
		transactionsIn,
		transactionsOut,
		transitionIndex,
		hightLightIndex,
		estimatesKeptsIn,
		estimatesKeptsOut,
		commitsIn,
		commitsOut
	};

	function spanSelect(element: any) {
		const date = dateArray[element.index];
		if (!date) return;
		const newSpan = get($selectedScenario.spansMap).get(date.format('YYYY-MM-DD'));
		$selectedSpan = newSpan;
	}

	onMount(() => {
		chart = new MainChart(
			chartElement,
			listenedData,
			spanSelect,
			theme,
			selectedDate,
			frequency,
			organisation
		);
	});
</script>

<Tooltip {dateArray} {organisation} {theme} />
<canvas
	bind:this={chartElement}
	on:mouseleave={() => ($toolTipShow = false)}
	on:mousemove={(e) => handleMouseMove(e, chart, chartElement)}
/>
