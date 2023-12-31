<script lang="ts">
	import { goto } from '$app/navigation';
	import BankIcon from '$lib/components/Icon/BankIcon.svelte';
	import PictoBankData from '$lib/components/Icon/PictoBankData.svelte';
	import type { Organisation } from '$lib/models/structurals/organisation';
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import AddIcon from '../../Icon/AddIcon.svelte';
	import LeftArrow from '../../Icon/LeftArrow.svelte';
	import Modal from '../../Layout/Modal/Modal.svelte';
	import type { ModalElement } from '../../Layout/Modal/util-modal';
	import ManualAccountAddModal from './ManualAccountAddModal.svelte';
	import SyncedAccountAdd from './SyncedAccountAdd.svelte';
	import { EventBankData } from '$lib/Events/bank-data-events';
	import { openLimitMenu, type limitMessageKey } from '$lib/components/App-Limits/util-limit';
	import { cn } from '$lib/utils/cn';

	const dispatch = createEventDispatcher();

	export let organisation: Organisation;
	export let buttonStyles = '';
	export let iconStyles = '';
	$: canAddManualAccount = organisation.limits.canAddManualAccount;
	let AddMenuModal: ModalElement;

	function openLimit(key: limitMessageKey) {
		dispatch('close');
		AddMenuModal?.close();
		openLimitMenu(key);
	}

	function handleOpenManualAccountAdd() {
		if (!$canAddManualAccount) return openLimit('manualAccount');
		AddMenuModal?.close();
		dispatch('close');
		goto(`/organisations/${organisation.info.id}/banks?option=createManualAccount`);
	}

	const menuButtonStyles =
		'grid w-full grid-cols-[20px_1fr] items-center gap-x-2 border-b border-b-black/5 px-3 py-[6px] text-left hover:bg-black/5 ';
</script>

<Modal
	bind:Modal={AddMenuModal}
	buttonStyles={cn(
		'flex gap-2 py-[2px] items-center bg-blueBank/90 hover:bg-blueBank rounded text-white font-semibold px-3',
		buttonStyles
	)}
	toolTipStyles="max-w-[50vw] w-[150px] p-1 text-sm text-balance "
	modalStyles="max-w-[50vw] w-[270px]"
	mode="flip"
>
	<svelte:fragment slot="button">
		<div class={iconStyles}>
			<AddIcon width={15} />
		</div>
		<div><slot /></div>
		<div class="-rotate-90 opacity-50">
			<LeftArrow />
		</div>
	</svelte:fragment>
	<svelte:fragment slot="tooltip">
		Ajouter une banque, un compte manuel ou synchronisé
	</svelte:fragment>
	<svelte:fragment slot="menu">
		<SyncedAccountAdd {organisation} buttonStyles={menuButtonStyles} on:close>
			<div class="flex w-full justify-center text-cyan-500"><BankIcon width={15} /></div>
			<div>Compte synchronisé</div>
		</SyncedAccountAdd>
		<button class={menuButtonStyles} on:click={handleOpenManualAccountAdd}>
			<div class="flex w-full justify-center text-blueBank"><PictoBankData width={20} /></div>
			<div>Compte manuel</div>
		</button>
	</svelte:fragment>
</Modal>
