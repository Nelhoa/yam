<script lang="ts">
	import type { Organisation } from '$lib/models/structurals/organisation';
	import Unlock from '../Icon/Unlock.svelte';
	import Lock from '../Icon/Lock.svelte';
	import { openLimitMenu } from './util-limit';

	export let organisation: Organisation;
	$: trial = organisation.limits.trial;
	$: isTrialOver = organisation.limits.isTrialover;

	function handleClick() {
		if (isTrialOver) return openLimitMenu('trialHasEnded');
		openLimitMenu('trialEndDate');
	}
</script>

{#if trial}
	<button
		on:click={handleClick}
		class="grid h-full grid-cols-[auto_1fr] items-center truncate rounded bg-blueBank px-[9px] font-semibold text-white hover:shadow-lg hover:shadow-blueBank/20 focus:outline-none"
	>
		{#if isTrialOver}
			<Lock width={12} />
		{:else}
			<Unlock width={12} />
		{/if}
		<div class="ml-[10px] hidden sm:block">
			{#if isTrialOver}
				Terminée
			{:else}
				{Math.ceil(trial.duration.as('days'))} jour(s)
			{/if}
		</div>
	</button>
{/if}
