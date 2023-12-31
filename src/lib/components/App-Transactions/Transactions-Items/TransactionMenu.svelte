<script lang="ts">
	import HorizontalThreeDots from '$lib/components/Icon/HorizontalThreeDots.svelte';
	import Modal from '$lib/components/Layout/Modal/Modal.svelte';
	import type { ModalElement } from '$lib/components/Layout/Modal/util-modal';
	import type { Transaction } from '$lib/models/datas/transaction';
	import copyToClipBoard from '$lib/utils/Public/copyToClipboard';
	import { cn } from '$lib/utils/cn';
	import { string } from 'zod';
	export let transaction: Transaction;
	export let showInfo = false;
	export let openOnMouse = false;
	export let MenuModal: ModalElement;
	$: isModalVisible = MenuModal?.isVisible;
	$: isIgnored = transaction.isIgnored;
	$: splitedParent = transaction.splitedParent;
	$: splitChilds = transaction.splitedChilds;
	const name = transaction.name;
</script>

<Modal
	mode="flip"
	buttonStyles={cn(
		'flex h-full w-[30px] items-center justify-center pl-[2px] text-black/10 hover:text-black/30',
		$isModalVisible && 'text-blueBank hover:text-blueBank'
	)}
	modalStyles="max-w-[70vw] w-[260px] flex flex-col items-start text-left border border-blueBank/40"
	bind:Modal={MenuModal}
	bind:openOnMouse
>
	<svelte:fragment slot="button">
		<HorizontalThreeDots width={18} />
	</svelte:fragment>
	<svelte:fragment slot="menu">
		<div class="w-full border-b p-3">
			<div class="mb-[3px] grid grid-cols-[auto_1fr] items-center gap-x-2 text-sm">
				<img src={transaction.account.logo} width="18" alt="Bank logo" />
				<div class="font-semibold">{transaction.displayAmount()}</div>
			</div>
			{#if showInfo}
				<div class="mb-1 text-[15px] text-black text-balance">
					{$name}
					<span class="text-sm text-black/50"> {transaction.displayBookingDate('Do MMM')}</span>
				</div>
			{/if}
			<div class="text-[14px] text-black/50 text-balance">
				{transaction.informations}
			</div>
		</div>
		<div class="w-full">
			<button
				class="w-full px-3 py-1 text-left hover:bg-black/5"
				on:click={() => {
					MenuModal?.close();
					transaction.resetName();
				}}>Rétablir le nom d’origine</button
			>
			{#if transaction.isManual}
				<button
					class="w-full px-3 py-1 text-left hover:bg-black/5"
					on:click={() => {
						MenuModal?.close();
						transaction.deleteTransaction();
					}}>Supprimer la transaction</button
				>
			{/if}
			<!-- <button class="w-full px-3 py-1 text-left hover:bg-black/5"
				>Créer une transaction miroir</button
			>
			<button class="w-full px-3 py-1 text-left hover:bg-black/5">Supprimer la transaction</button> -->
			<button
				on:click={() => {
					MenuModal?.close();
					transaction.switchIgnore();
				}}
				class="w-full px-3 py-1 text-left hover:bg-black/5"
				>{$isIgnored ? 'Rétablir la transaction' : 'Ignorer la transaction'}</button
			>
			{#if $splitedParent}
				<button
					on:click={() => {
						MenuModal?.close();
						transaction.resetSplit();
					}}
					class="w-full px-3 py-1 text-left hover:bg-black/5"
				>
					Réinitialiser le découpage
				</button>
			{/if}
			{#if !$splitChilds && !$splitedParent}
				<button
					on:click={() => {
						MenuModal?.close();
						transaction.split();
					}}
					class="w-full px-3 py-1 text-left hover:bg-black/5"
				>
					Découper la transaction
				</button>
			{/if}
			<button
				on:click={() => copyToClipBoard(String(transaction.id))}
				class="w-full px-3 py-1 text-left hover:bg-black/5"
			>
				Id : {transaction.id}
			</button>
		</div>
	</svelte:fragment>
</Modal>
