<script lang="ts">
	import type { Formula } from '$lib/models/formulas/formula';
	import type { Organisation } from '$lib/models/structurals/organisation';
	import LimitLocker from '../App-Limits/LimitLocker.svelte';
	import { openLimitMenu } from '../App-Limits/util-limit';
	import Loader from '../Icon/Loader.svelte';
	import EditFormula from './EditFormula.svelte';
	import FormulaTile from './FormulaTile.svelte';
	import { slide } from 'svelte/transition';

	export let organisation: Organisation;
	const { selectedScenario } = organisation;
	export let selectedFormula: Formula | undefined;
	export let isEditing = false;
	$: $selectedScenario.formulasManager.loadFormulas();
	$: functions = $selectedScenario.formulasManager.formulas;
	$: canAddFormula = organisation.limits.canRunFormulas;

	function goToEditMode(formula?: Formula) {
		if (!canAddFormula) return openLimitMenu('addFormula');
		selectedFormula = formula;
		isEditing = true;
	}
</script>

<div class="mt-4">
	{#if !$functions}
		<div class="m-5 text-blueBank/40">
			<Loader width={90} />
		</div>
	{:else if isEditing}
		<EditFormula {organisation} formula={selectedFormula} bind:isEditing />
	{:else}
		<div class="flex flex-col justify-start">
			{#each $functions as formula (formula.sharedUuid)}
				<div transition:slide|local class="">
					<FormulaTile {formula} on:click={() => goToEditMode(formula)} />
				</div>
			{/each}
			<div class="flex w-full justify-start">
				<button
					on:click={() => goToEditMode()}
					class="mx-4 mt-5 rounded bg-blueBank/[.07] px-2 py-[3px] hover:bg-blueBank/10"
				>
					+ Ajouter une formule
					<LimitLocker locked={!canAddFormula} />
				</button>
			</div>
		</div>
	{/if}
</div>
