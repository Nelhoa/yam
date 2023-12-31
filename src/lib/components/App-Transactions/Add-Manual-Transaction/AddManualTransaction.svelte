<script lang="ts">
	import CenteredModal from '$lib/components/Layout/Modal/CenteredModal.svelte';
	import Modal from '$lib/components/Layout/Modal/Modal.svelte';
	import type { ModalElement } from '$lib/components/Layout/Modal/util-modal';
	import type { Account } from '$lib/models/banks/account';
	import type { Organisation } from '$lib/models/structurals/organisation';
	import { get } from 'svelte/store';
	import AddMultipleTransaction from './AddMultipleTransaction.svelte';
	import AddOneTransaction from './AddOneTransaction.svelte';
	import { ManualAccount } from '$lib/models/banks/account-manual';

	export let organisation: Organisation;
	export let multipleOnly = false;
	export let account: Account | undefined = undefined;
	export let accountDisabled = false;
	export let title = '+ Transaction';
	export let buttonStyles = '';

	const accounts = get(organisation.accounts);
	if (accounts.filter((item) => item instanceof ManualAccount).length === 0) multipleOnly = true;

	let MultipleAddModal: ModalElement;
	let UniqueAddModal: ModalElement;

	function switchToMultiple() {
		UniqueAddModal?.close();
		MultipleAddModal?.open();
	}
</script>

{#if !multipleOnly}
	<CenteredModal
		bind:Modal={UniqueAddModal}
		modalStyles="p-5 max-w-[90vw] w-[450px] flex flex-col gap-3"
		backdropStyles="bg-black/10"
		{buttonStyles}
	>
		<svelte:fragment slot="button">{title}</svelte:fragment>
		<svelte:fragment slot="menu"
			><AddOneTransaction
				{organisation}
				on:switch={switchToMultiple}
				on:close={() => UniqueAddModal?.close()}
			/></svelte:fragment
		>
	</CenteredModal>
{/if}

<CenteredModal
	bind:Modal={MultipleAddModal}
	noButton={!multipleOnly}
	{buttonStyles}
	backdropStyles="bg-black/10"
	modalStyles="max-w-[95vw] w-[550px]"
>
	<svelte:fragment slot="button">{title}</svelte:fragment>
	<svelte:fragment slot="menu">
		<AddMultipleTransaction
			{account}
			{accountDisabled}
			{organisation}
			on:close={() => MultipleAddModal?.close()}
		/>
	</svelte:fragment>
</CenteredModal>
