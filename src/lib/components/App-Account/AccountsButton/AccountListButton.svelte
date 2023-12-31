<script lang="ts">
	import type { Organisation } from '$lib/models/structurals/organisation';
	import { displayCurrency } from '$lib/utils/Public/Helpers/displayHelpers';
	import Modal from '$lib/components/Layout/Modal/Modal.svelte';
	import type { ModalElement } from '$lib/components/Layout/Modal/util-modal';
	import AccountList from './AccountList.svelte';
	import BankIcon from '$lib/components/Icon/BankIcon.svelte';
	import Menu from '../AddMenu/Menu.svelte';

	export let organisation: Organisation;
	let accountListModal: ModalElement;
	$: accounts = organisation.accounts;
	$: todayBalance = organisation.todayBalance;
	let windowWidth = 0;
</script>

<svelte:window bind:innerWidth={windowWidth} />

{#if $accounts && $accounts.length === 0}
	<Menu
		iconStyles="hidden"
		buttonStyles="flex h-full min-w-[150px] max-w-[170px] items-center gap-2 rounded bg-blueBank/10 px-2 font-semibold text-black hover:bg-blueBank/20"
		{organisation}>Lier votre banque</Menu
	>
{:else}
	<Modal
		toolTipStyles="text-sm px-2 py-1 text-black/80"
		buttonStyles="group flex h-full items-center gap-2 rounded bg-blueBank/10 px-2 font-semibold text-black hover:bg-blueBank/20"
		modalStyles="w-[260px] max-w-[90vw]"
		bind:Modal={accountListModal}
	>
		<svelte:fragment slot="button">
			<div class="text-blueBank">
				<BankIcon width={13} />
			</div>
			{displayCurrency($todayBalance, 'eur')}
		</svelte:fragment>
		<svelte:fragment slot="tooltip">Mes comptes bancaires</svelte:fragment>
		<svelte:fragment slot="menu">
			<AccountList {organisation} on:close={() => accountListModal?.close()} />
		</svelte:fragment>
	</Modal>
{/if}
