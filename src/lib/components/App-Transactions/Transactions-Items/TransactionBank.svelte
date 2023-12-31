<script lang="ts">
	import Modal from '$lib/components/Layout/Modal/Modal.svelte';
	import type { Transaction } from '$lib/models/datas/transaction';
	import { displayCurrency } from '$lib/utils/Public/Helpers/displayHelpers';
	import { cn } from '$lib/utils/cn';
	export let transaction: Transaction;
	export let styles = '';
	let isDemo = transaction.account.bank?.isDemo ?? false;
	$: todayBalance = transaction.account.todayBalance;
</script>

<Modal
	toolTipOnly
	buttonStyles={cn(
		'relative ml-4 mr-2 flex h-[21px] w-[21px] items-center justify-center opacity-60 hover:opacity-100',
		styles,
		!isDemo && 'overflow-hidden'
	)}
	toolTipStyles={cn('p-2 max-w-[150px]')}
>
	<svelte:fragment slot="button">
		<div>
			<img src={transaction.account.logo} alt="Bank logo" />
			{#if isDemo}
				<div class="absolute -right-1 top-0 h-[6px] w-[6px] rounded-full bg-yellow-500/60" />
			{/if}
		</div>
	</svelte:fragment>
	<svelte:fragment slot="tooltip">
		<div
			class={cn(
				'w-full text-[14px] font-semibold leading-tight text-balance first-letter:uppercase',
				isDemo && 'text-yellow-600'
			)}
		>
			{isDemo ? 'Données de démo' : transaction.account.displayName()}
		</div>
		<div class="mt-[4px] text-sm opacity-70">
			Solde {displayCurrency($todayBalance, 'EUR')}
		</div>
	</svelte:fragment>
</Modal>
