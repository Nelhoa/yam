<script lang="ts">
	import type { Transaction } from '$lib/models/datas/transaction';
	import { wait } from '$lib/utils/Public/wait';
	import { cn } from '$lib/utils/cn';
	import type { ModalElement } from '../Layout/Modal/util-modal';
	import TransactionBank from './Transactions-Items/TransactionBank.svelte';
	import TransactionCategory from './Transactions-Items/TransactionCategory.svelte';
	import TransactionDate from './Transactions-Items/TransactionDate.svelte';
	import TransactionInput from './Transactions-Items/TransactionInput.svelte';
	import TransactionMenu from './Transactions-Items/TransactionMenu.svelte';
	import TransactionValue from './Transactions-Items/TransactionValue.svelte';
	export let transaction: Transaction;
	export let isSmall: boolean;
	let MenuModal: ModalElement;
	$: isMenuOpen = MenuModal?.isVisible;
	let openOnMouse = false;
	const baseStyles =
		'grid h-full w-full items-center border border-blueBank/0 border-b border-b-black/[.05] px-3 hover:bg-blueBank/[.02]';
	const rowOpenStyles = 'bg-white border border-blueBank/40 shadow shadow-blueBank/20';

	async function handleContextMenuOpen() {
		openOnMouse = true;
		await wait(20);
		MenuModal?.open();
	}

	$: splitedChilds = transaction.splitedChilds;
	$: isIgnored = transaction.isIgnored;
</script>

{#if !$splitedChilds}
	<div class={cn('group w-full @container', $isIgnored && 'opacity-30 blur-[0.8px]')}>
		{#if !isSmall}
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div
				on:contextmenu|preventDefault|stopPropagation={handleContextMenuOpen}
				class={cn(
					baseStyles,
					'h-[30px] grid-cols-[2fr_120px_3fr_65px_auto_auto] @[620px]:grid-cols-[130px_120px_1fr_65px_auto_auto] ',
					$isMenuOpen && rowOpenStyles
				)}
			>
				<TransactionCategory {transaction} />
				<TransactionValue {transaction} />
				<TransactionInput {transaction} />
				<TransactionDate {transaction} />
				<TransactionBank {transaction} />
				<TransactionMenu {transaction} bind:MenuModal bind:openOnMouse />
			</div>
		{:else}
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div
				on:contextmenu|preventDefault={() => MenuModal?.open()}
				class={cn(
					'mx-3 mb-2 rounded border border-transparent bg-blueBank/[.05] p-[2px] hover:border-blueBank/10 hover:bg-blueBank/[.02] ',
					$isMenuOpen && rowOpenStyles
				)}
			>
				<div class="mt-[2px] grid grid-cols-[1fr_auto] items-center">
					<div class="flex items-center">
						<TransactionBank styles="mx-2 w-[18px]" {transaction} />
						<TransactionValue styles="px-0 text-black" {transaction} />
						<TransactionDate {transaction} />
					</div>

					<TransactionMenu {transaction} showInfo={true} bind:MenuModal bind:openOnMouse />
				</div>

				<div class="grid h-[28px] grid-cols-[1fr_auto] items-center">
					<TransactionInput {transaction} styles="px-1 " />
					<TransactionCategory
						reverseDisplay
						{transaction}
						styles="text-black/80 max-w-[150px] text-sm  rounded py-1 px-1"
					/>
				</div>
			</div>
		{/if}
	</div>
{/if}
