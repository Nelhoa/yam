<script lang="ts">
	import type { Organisation } from '$lib/models/structurals/organisation';
	import CashFlowChart from './CashFlowChart.svelte';
	import { derived } from 'svelte/store';
	import ViewedScenario from './ViewedScenario.svelte';
	import _, { concat, uniq } from 'lodash';
	import { scenariosData } from './scenarios-data-store';
	import { MainChartScroll } from '$lib/stores/main-chart-scroll-store';
	import CashFlowTicks from './CashFlowTicks.svelte';
	import { cn } from '$lib/utils/cn';

	export let organisation: Organisation;
	const { selectedScenario, selectedSpan } = organisation;
	$: selectedDate = $selectedSpan?.start ?? null;
	$: displayedSpans = $selectedScenario.displayedSpans;
	$: dateArray = $displayedSpans.map((span) => span.start);
	let mainChartElement: HTMLDivElement;

	$: transactionsIn = derived(
		$displayedSpans.map((span) => span.totals.transactionsIn),
		(datas) => datas
	);
	$: transactionsOut = derived(
		$displayedSpans.map((span) => span.totals.transactionsOut),
		(datas) => datas
	);
	$: estimatesKeptsIn = derived(
		$displayedSpans.map((span) => span.totals.estimatesKeptsIn),
		(datas) => datas
	);
	$: estimatesKeptsOut = derived(
		$displayedSpans.map((span) => span.totals.estimatesKeptsOut),
		(datas) => datas
	);
	$: commitsIn = derived(
		$displayedSpans.map((span) => span.totals.commitsIn),
		(datas) => datas
	);
	$: commitsOut = derived(
		$displayedSpans.map((span) => span.totals.commitsOut),
		(datas) => datas
	);

	const viewedScenarios = organisation.viewedScenarios;
	const delayedScenarios = organisation.delayedScenarios;
	$: allViewedScenarios = uniq(concat($viewedScenarios, [$selectedScenario], $delayedScenarios));

	$: if (mainChartElement) mainChartElement.scrollLeft = $MainChartScroll;

	function handleScroll() {
		$MainChartScroll = mainChartElement.scrollLeft;
	}
</script>

{#if dateArray?.length > 0}
	<div class="hidden">
		{#each allViewedScenarios as viewedScenario (viewedScenario.id)}
			<div>
				<ViewedScenario {viewedScenario} selectedScenario={$selectedScenario} />
			</div>
		{/each}
	</div>
	{#if $scenariosData.length > 0}
		<div class="grid h-full grid-cols-[160px_1fr]">
			<div class={'border-r  pb-4 shadow-lg shadow-blueBank/20'}>
				<CashFlowTicks />
			</div>
			<div
				class="noScrollBar h-full w-full overflow-x-auto"
				on:scroll={handleScroll}
				bind:this={mainChartElement}
			>
				<div
					class="mr-1 h-full overflow-hidden pb-4"
					style={`width: ${85 * $displayedSpans.length}px; height: 100%;`}
				>
					<div
						class="-ml-[10px]"
						style={`width: ${20 + 85 * $displayedSpans.length}px; height: 100%;`}
					>
						<CashFlowChart
							{selectedDate}
							{dateArray}
							transactionsIn={$transactionsIn}
							transactionsOut={$transactionsOut}
							estimatesKeptsIn={$estimatesKeptsIn}
							estimatesKeptsOut={$estimatesKeptsOut}
							commitsIn={$commitsIn}
							commitsOut={$commitsOut}
							frequency={organisation.frequency}
							{organisation}
							on:chartClick
						/>
					</div>
				</div>
			</div>
		</div>
	{/if}
{/if}
