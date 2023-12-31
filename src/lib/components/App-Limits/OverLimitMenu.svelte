<script lang="ts">
	import type { Organisation } from '$lib/models/structurals/organisation';
	import type { OrganisationLimits } from '$lib/models/structurals/organisation-limits';
	import { wait } from '$lib/utils/Public/wait';
	import { cn } from '$lib/utils/cn';
	import { createEventDispatcher } from 'svelte';
	import Cross from '../Icon/Cross.svelte';
	import Lock from '../Icon/Lock.svelte';
	import { limitMessages, type limitMessageKey } from './util-limit';
	import { goto } from '$app/navigation';
	const dispatch = createEventDispatcher();

	export let organisation: Organisation;
	export let limitMessageKey: limitMessageKey = 'default';
	$: limits = organisation.limits as OrganisationLimits;
	$: actualScenariosNumber = limits.scenariosNumber.actual;
	$: actualBankNumber = limits.bankNumber.actual;
	$: actualAccountsNumber = limits.accountNumber.actual;
	$: actualManualAccountsNumber = limits.manualAccountNumber.actual;
	$: canAddAccount = limits.canAddAccount;
	$: canAddManualAccount = limits.canAddManualAccount;
	$: canAddBank = limits.canAddBank;
	$: trial = limits.trial;

	function onButtonMount(button: HTMLButtonElement) {
		async function focus() {
			await wait(30);
			button.focus();
		}

		focus();
	}

	function limitStyle(limitOver: boolean) {
		return cn('truncate border-b border-b-blueBank/10');
	}

	function createManualAccount() {
		dispatch('close');
		goto(`/organisations/${organisation.info.id}/banks?option=createManualAccount`);
	}
</script>

<div class="flex items-start justify-between">
	<div class="mb-2 flex items-center justify-start gap-3 text-[17px] font-semibold">
		<div class="text-blueBank"><Lock width={15} /></div>
		<div>Limites atteintes</div>
	</div>
	<button class="text-black/20 hover:text-black/40" on:click={() => dispatch('close')}>
		<Cross width={15} />
	</button>
</div>

<div class="mb-5 text-balance">
	<div>{limitMessages[limitMessageKey]}</div>
	{#if ['account', 'bank'].includes(limitMessageKey) && $canAddManualAccount}
		<button
			on:click={createManualAccount}
			class="mt-3 rounded bg-black/5 px-3 py-[2px] text-[15px] hover:bg-black/10"
			>Ajouter un compte manuel à la place</button
		>
	{/if}
</div>

<div class="mt-2 grid grid-cols-[1fr_auto] gap-2">
	<div class={limitStyle(!limits.canRunFormulas)}>Formules personnalisées</div>
	<div>{limits.canRunFormulas ? 'Activées' : 'Désactivées'}</div>
</div>
<div class="mt-1 grid grid-cols-[1fr_auto] gap-2">
	<div class={limitStyle(!limits.canAutoCategorise)}>Catégorisation automatique</div>
	<div>{limits.canAutoCategorise ? 'Activée' : 'Désactivée'}</div>
</div>
<div class="mt-1 grid grid-cols-[1fr_auto] gap-2">
	<div class={limitStyle(!$canAddBank)}>Banques synchronisées</div>
	<div>
		<span class="number">{$actualBankNumber}</span> /
		<span class="number">{limits.bankNumber.max}</span>
	</div>
</div>
<div class="mt-1 grid grid-cols-[1fr_auto] gap-2">
	<div class={limitStyle(!$canAddAccount)}>Comptes synchronés</div>
	<div>
		<span class="number">{$actualAccountsNumber}</span> /
		<span class="number">{limits.accountNumber.max}</span>
	</div>
</div>
<div class="mt-1 grid grid-cols-[1fr_auto] gap-2">
	<div class="truncate border-b border-b-blueBank/10">Comptes manuels</div>
	<div>
		<span class="number">{$actualManualAccountsNumber}</span> /
		<span class="number">{limits.manualAccountNumber.max}</span>
	</div>
</div>
<div class="mt-1 grid grid-cols-[1fr_auto] gap-2">
	<div class="truncate border-b border-b-blueBank/10">Scénarios</div>
	<div>
		<span class="number">{$actualScenariosNumber}</span> /
		<span class="number">{limits.scenariosNumber.max}</span>
	</div>
</div>

{#if trial && !limits.isTrialover}
	<div class="mt-5 text-sm text-black/60">
		Votre organisation est en période d’essai qui se terminera le {trial.ends.format(
			'Do MMMM YYYY'
		)}. Pendant cette période, profitez gratuitement d’un compte bancaire synchronisé, de la
		catégorisation automatique et des formules personnalisées.
	</div>
{/if}

<div class="flex justify-center">
	<button
		on:click={() => window.open('/tarifs')}
		use:onButtonMount
		class="mt-5 self-end rounded bg-gradient-to-r from-[#0086DC] to-[#45B7FF] px-3 py-[3px] text-[16px] font-bold text-white hover:shadow-lg hover:shadow-blueBank/30 focus:shadow-lg focus:shadow-blueBank/30 focus:outline-none"
	>
		Voir nos tarifs
	</button>
</div>
