<script lang="ts">
	import { goto } from '$app/navigation';
	import { openLimitMenu } from '$lib/components/App-Limits/util-limit';
	import AddIcon from '$lib/components/Icon/AddIcon.svelte';
	import Modal from '$lib/components/Layout/Modal/Modal.svelte';
	import type { ModalElement } from '$lib/components/Layout/Modal/util-modal';
	import type { Bank } from '$lib/models/banks/bank';
	import { ManualBank } from '$lib/models/banks/bank-manual';
	import { NordigenBank } from '$lib/models/banks/bank-nordigen';
	import type { Organisation } from '$lib/models/structurals/organisation';
	import { cn } from '$lib/utils/cn';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let organisation: Organisation;
	export let SyncedAccountModal: ModalElement = undefined;
	export let buttonStyles = '';
	$: canAddBank = organisation.limits.canAddBank;
	$: canAddAccount = organisation.limits.canAddAccount;
	$: banks = organisation.banksManager.banks;
	$: isActive = SyncedAccountModal?.isVisible;
	$: filteredBanks = $banks?.filter((item) => !(item instanceof ManualBank)) ?? [];

	function leave() {
		dispatch('close');
		SyncedAccountModal?.close();
		return true;
	}

	async function handleBankSelect(bank: Bank | 'none') {
		if (!$canAddAccount) {
			leave();
			openLimitMenu('account');
			return;
		}
		if (bank instanceof NordigenBank) {
			leave();
			goto(`/organisations/${organisation.info.id}/banks/${bank.row.id}/nordigen/add-accounts`);
			return;
		}
		if (!$canAddBank) {
			leave();
			openLimitMenu('bank');
			return;
		}
		if (bank === 'none') {
			leave();
			goto(`/organisations/${organisation.info.id}/add-nordigen-bank`);
		}
	}
</script>

{#if filteredBanks.length > 0}
	<Modal
		bind:Modal={SyncedAccountModal}
		modalStyles="max-w-[80vw] w-[260px] pb-3 border border-blueBank/50"
		buttonStyles={cn(buttonStyles, $isActive && 'bg-black/5 hover:bg-black/10')}
	>
		<svelte:fragment slot="button"><slot /></svelte:fragment>
		<svelte:fragment slot="menu">
			<div class="px-3 pb-1 pt-2 font-semibold">Ajouter le compte dans</div>
			<div>
				{#each filteredBanks as bank}
					<button
						on:click={() => handleBankSelect(bank)}
						class="grid w-full grid-cols-[22px_1fr] items-center gap-2 border-b border-b-black/5 px-3 py-1 hover:bg-black/5 focus:shadow focus:outline-none"
					>
						<div class="flex h-full w-full items-center justify-center">
							<img src={bank.row.logo} width="20" class="rounded" alt="" />
						</div>
						<div class="truncate text-left">{bank.row.name}</div>
					</button>
				{/each}
			</div>
			<button
				class="grid w-full grid-cols-[22px_1fr] items-center gap-2 px-3 py-1 hover:bg-black/5 focus:shadow focus:outline-none"
				on:click={() => handleBankSelect('none')}
			>
				<div class="flex h-full w-full items-center justify-center text-black/20">
					<AddIcon width={18} />
				</div>
				<div class="truncate text-left">Nouvelle banque</div>
			</button>
		</svelte:fragment>
	</Modal>
{:else}
	<button class={cn(buttonStyles)} on:click={() => handleBankSelect('none')}><slot /></button>
{/if}
