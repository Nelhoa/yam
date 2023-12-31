<script lang="ts">
	import type { Organisation } from '$lib/models/structurals/organisation';
	import { readable } from 'svelte/store';
	import Loader from '../Icon/Loader.svelte';
	import Reload from '../Icon/Reload.svelte';
	import dayjs from 'dayjs';
	import Modal from '../Layout/Modal/Modal.svelte';
	import LimitLocker from '../App-Limits/LimitLocker.svelte';
	import { openLimitMenu } from '../App-Limits/util-limit';

	export let organisation: Organisation;
	$: canRunFormulas = organisation.limits.canRunFormulas;
	const scenarioManager = organisation.scenarioManager;
	const loading = scenarioManager.updateFormulasLoading;
	let secondsDisabled = 0;
	const isDisabled = readable<boolean>(false, (set) => {
		const interval = setInterval(() => {
			const difference = dayjs().diff(scenarioManager.lastFormulasReload);
			secondsDisabled = Math.round((10000 - difference) / 1000);
			set(difference < 10000);
		}, 1000);
		return () => clearInterval(interval);
	});

	function handleRunFormulas() {
		if (!canRunFormulas) return openLimitMenu('runFormula');
		scenarioManager.runEveryFormulas();
	}
</script>

<Modal
	disabled={$loading || $isDisabled}
	clickFunction={() => handleRunFormulas()}
	buttonStyles="h-full flex items-center justify-center rounded bg-blueBank/10 px-2 font-semibold text-black hover:bg-blueBank/30 disabled:border-black/10 disabled:bg-black/5 disabled:text-black/50"
	toolTipStyles="px-3 py-1"
>
	<svelte:fragment slot="button">
		{#if $loading}
			<div class="text-blueBank/40">
				<Loader width={50} />
			</div>
		{:else}
			<Reload width={20} />
			<LimitLocker locked={!canRunFormulas} />
		{/if}
	</svelte:fragment>
	<svelte:fragment slot="tooltip">
		{#if $isDisabled}
			Prêt dans {secondsDisabled}s
		{:else}
			Recalculer les formules
		{/if}
	</svelte:fragment>
</Modal>
