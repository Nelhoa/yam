<script lang="ts">
	import { slide } from 'svelte/transition';
	import type { Organisation } from '$lib/models/structurals/organisation';
	import type { Scenario } from '$lib/models/scenario/scenario';
	import InlineAddScenario from './InlineAddScenario.svelte';
	import Bin from '../Icon/Bin.svelte';
	import AddIcon from '../Icon/AddIcon.svelte';
	import View from '../Icon/View.svelte';
	import { colors } from './scenario-colors';
	import _ from 'lodash';
	import type { Readable } from 'svelte/store';
	import { openLimitMenu } from '../App-Limits/util-limit';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let scenario: Scenario;
	export let organisation: Organisation;
	export let selected: Scenario | null;
	export let scenariosNumber: Readable<number>;
	export let scenariosLimit: number;
	const childs = scenario.childs;
	const selectedScenario = organisation.selectedScenario;
	const viewedScenarios = organisation.viewedScenarios;
	let isAddChildVisible = false;
	let selectedColor = _.sample(colors)!.hex;
	$: isViewed = $viewedScenarios.includes(scenario);
	$: limitReached = $scenariosNumber >= scenariosLimit;

	function deleteScenario() {
		scenario.selfDelete();
	}

	function handleViewClick() {
		if (!isViewed) return scenario.setAsViewed();
		scenario.unsetAsViewed();
	}

	async function handleSelect() {
		if (scenario === $selectedScenario) return;
		await scenario.selectScenario();
	}

	function handleAddScenario() {
		if (limitReached) {
			dispatch('close');
			return openLimitMenu('addScenario');
		}
		isAddChildVisible = !isAddChildVisible;
	}
</script>

<div>
	<button
		on:click={handleSelect}
		class="group flex w-full items-center justify-between gap-2 rounded px-2 py-[2px] hover:outline hover:outline-1 hover:outline-blueBank/40"
		class:selectedByOrg={$selectedScenario === scenario}
	>
		<div class="grid grid-cols-[auto_1fr] items-center gap-x-3">
			<div class="h-[12px] w-[12px] rounded" style={`background-color: ${scenario.color};`} />
			<div class="truncate">{scenario.name}</div>
		</div>
		<!-- <div class="text-black/25">({scenario.id})</div> -->

		<div class="flex gap-[10px]">
			<div class="hidden items-center gap-[10px] group-hover:flex">
				{#if !scenario.isMain}
					<button
						on:click|stopPropagation={deleteScenario}
						class="text-black/[.12] hover:text-red-500/80"
					>
						<Bin width={12} />
					</button>
				{/if}
				<button
					class="rounded font-bold text-blueBank/40 hover:text-blueBank/80 disabled:text-black/10"
					on:click|stopPropagation={handleAddScenario}
				>
					<AddIcon width={16.5} />
				</button>
			</div>
			<button
				on:click|stopPropagation={handleViewClick}
				class="text-black/[.15] hover:text-blueBank/30"
				class:isNotViewed={!isViewed}
				class:isViewed><View width={18} /></button
			>
		</div>
	</button>

	<!-- <div>Add scenario</div> -->
	{#if isAddChildVisible}
		<div transition:slide|local class="mt-[10px]">
			<InlineAddScenario
				parentScenario={scenario}
				bind:isVisible={isAddChildVisible}
				bind:selectedColor
			/>
		</div>
	{/if}
	{#each $childs as child (child.id)}
		<div transition:slide|local class="ml-4 mt-[10px]">
			<svelte:self
				on:close
				scenario={child}
				{organisation}
				bind:selected
				{scenariosNumber}
				{scenariosLimit}
			/>
		</div>
	{/each}
</div>

<style lang="postcss">
	.selectedByOrg {
		@apply outline outline-1 outline-blueBank;
	}

	.isNotViewed {
		@apply hidden group-hover:flex;
	}

	.isViewed {
		@apply text-blueBank hover:text-blueBank/80;
	}
</style>
