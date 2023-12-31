<script lang="ts">
	import ScenarioTree from './ScenarioTree.svelte';
	import type { Organisation } from '$lib/models/structurals/organisation';
	import type { Scenario } from '$lib/models/scenario/scenario';
	import Modal from '../Layout/Modal/Modal.svelte';
	import ScenariosLimitMenu from '../App-Limits/ScenariosNumber.svelte';
	import { cn } from '$lib/utils/cn';
	import { fly } from 'svelte/transition';
	import type { ModalElement } from '../Layout/Modal/util-modal';

	export let organisation: Organisation;
	let ScenariosModal: ModalElement;
	const mainScenario = organisation.scenarioManager.mainScenario;
	let selected: Scenario | null = null;
	const selectedScenario = organisation.selectedScenario;

	const scenariosNumber = organisation.limits.scenariosNumber.actual;
	const scenariosLimit = organisation.limits.scenariosNumber.max;
</script>

<Modal
	bind:Modal={ScenariosModal}
	modalStyles="bg-white p-3 pb-5 sm:w-[320px]"
	buttonStyles={cn(
		'rounded bg-blueBank/5 px-3 font-semibold hover:bg-blueBank/20 max-w-[180px] truncate flex-shrink-0 min-w-[120px] h-full items-center',
		$selectedScenario !== $mainScenario && `text-white`
	)}
	buttonCSS={$selectedScenario !== $mainScenario
		? `background-color: ${$selectedScenario.color}`
		: ''}
>
	<svelte:fragment slot="button">
		{#key $selectedScenario}
			<div in:fly={{ y: 10 }} class="grid h-full w-full grid-cols-1 items-center truncate">
				{$selectedScenario.name}
			</div>
		{/key}
	</svelte:fragment>
	<div slot="menu">
		<ScenariosLimitMenu number={$scenariosNumber} limit={scenariosLimit} />

		<div class=" h-full bg-white">
			<ScenarioTree
				on:close={() => ScenariosModal?.close()}
				bind:scenario={$mainScenario}
				bind:organisation
				bind:selected
				{scenariosNumber}
				{scenariosLimit}
			/>
		</div>
	</div>
</Modal>

<style lang="postcss">
	.number {
		@apply rounded border-b-2 border-blueBank/20 bg-blueBank/[.03] px-2;
	}
</style>
