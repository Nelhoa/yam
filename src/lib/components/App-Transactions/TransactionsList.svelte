<script lang="ts">
	import TransactionLine from '$lib/components/App-Transactions/TransactionLine.svelte';
	import type { Transaction } from '$lib/models/datas/transaction';
	import { tweened } from 'svelte/motion';
	import _ from 'lodash';
	import { quadOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	export let transactions: Transaction[];
	let selected: Transaction | null;
	let width: number;
	$: isSmall = width < 460;
	let shownTransactionsNumber = tweened(10, {
		duration: 1500,
		easing: quadOut
	});
	$: shownTransactions = _.slice(transactions, 0, $shownTransactionsNumber);

	function handleSelected(event: CustomEvent) {
		if (selected === event.detail.transaction) {
			selected = null;
		} else {
			selected = event.detail.transaction;
		}
	}
</script>

<div class="grid flex-grow pb-5" bind:clientWidth={width}>
	<div class="text-[14px]">
		{#each shownTransactions as transaction (transaction.id)}
			<div in:fly|local={{ y: 10, duration: 400 }}>
				<TransactionLine {transaction} on:selected={handleSelected} {isSmall} />
			</div>
		{/each}
		{#if transactions.length > $shownTransactionsNumber}
			<button
				class="m-5 rounded bg-black/[.03] px-3 py-[2px] hover:bg-blueBank/10"
				on:click={() => ($shownTransactionsNumber += 25)}>Afficher plus</button
			>
		{/if}
	</div>
</div>
