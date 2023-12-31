<script lang="ts">
	import type { Scenario } from '$lib/models/scenario/scenario';
	import { onDestroy, onMount } from 'svelte';
	import { derived } from 'svelte/store';
	import { ScenarioData, scenariosData } from './scenarios-data-store';
	export let viewedScenario: Scenario;
	export let selectedScenario: Scenario;

	let scenarioData = new ScenarioData(viewedScenario, viewedScenario === selectedScenario);
	$: updateIsSelected(viewedScenario === selectedScenario);
	$: displayedSpans = viewedScenario.displayedSpans;
	$: endBalances = derived(
		$displayedSpans.map((span) => span.totals.endBalance),
		(endBalancesArray) => endBalancesArray
	);
	$: updateEndBalances($endBalances);

	function updateEndBalances(balances: number[]) {
		scenarioData.endBalances = balances;
		$scenariosData = $scenariosData;
	}

	function updateIsSelected(selected: boolean) {
		// console.log(`${viewedScenario.name} ${selected ? 'is' : 'is not'} selected`);
		scenarioData.isSelected = selected;
		$scenariosData = $scenariosData;
	}

	onMount(() => {
		$scenariosData = [...$scenariosData, scenarioData];
	});

	onDestroy(() => {
		$scenariosData = $scenariosData.filter((data) => data !== scenarioData);
	});
</script>
