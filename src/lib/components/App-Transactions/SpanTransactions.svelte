<script lang="ts">
	import Loader from '$lib/components/Icon/Loader.svelte';
	import TransactionsList from '$lib/components/App-Transactions/TransactionsList.svelte';
	import type { Span } from '$lib/models/spans/span';
	import _ from 'lodash';
	import { quintInOut, quintOut } from 'svelte/easing';
	import { get } from 'svelte/store';
	import { crossfade, slide } from 'svelte/transition';
	import AddManualTransaction from './Add-Manual-Transaction/AddManualTransaction.svelte';
	import { organisation } from '$lib/stores/organisations-store';
	import Menu from '../App-Account/AddMenu/Menu.svelte';
	export let span: Span;
	const transactions = span.transactionsManager.transactions;
	const accounts = $organisation?.accounts;
	span.transactionsManager.loadTransactions();
	$: groupedTransactions = _.groupBy(
		_.orderBy($transactions, (item) => get(item.category)?.type),
		(item) => get(item.category)?.type
	);

	const [send, receive] = crossfade({
		duration: (d) => Math.sqrt(d * 2000),
		easing: quintInOut,

		fallback(node, params) {
			const style = getComputedStyle(node);
			const transform = style.transform === 'none' ? '' : style.transform;

			return {
				duration: 200,
				easing: quintOut,
				css: (t) => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`
			};
		}
	});

	const groupNames: { [key: string]: string } = {
		income: 'Encaissements',
		outcome: 'Décaissements',
		key: 'Indicateurs clés'
	};
</script>

<div>
	{#if !$transactions}
		<div class="m-5 text-blueBank/40">
			<Loader width={90} />
		</div>
	{:else if $transactions.length > 0}
		{#each Object.keys(groupedTransactions) as key (key)}
			{@const transactions = groupedTransactions[key]}

			{#if transactions && transactions.length > 0}
				<div transition:slide|local class="mt-4 text-sm">
					<div class="groupTitle">
						{groupNames[key] ?? 'Sans catégorie'}
					</div>
					<TransactionsList {transactions} />
				</div>
			{/if}
		{/each}
	{:else if $accounts && $accounts?.length > 0}
		<div class="groupTitle pt-3">Aucune transaction</div>
	{/if}

	{#if $organisation && $accounts?.length === 0}
		<div class="mx-5 mt-10 flex flex-col items-center justify-center">
			<img
				class="mb-3 max-w-[130px]"
				src="https://assets.bank-data.app/bank-illustration.webp"
				alt=""
			/>
			<div class="max-w-[200px] text-center font-poppins font-semibold text-gray-600 text-balance">
				Vous n’avez pas encore de compte bancaire
			</div>

			<div class="mt-3">
				<Menu
					iconStyles="text-rose-500"
					buttonStyles="bg-blueBank/5 border border-blueBank/20 text-black/70 font-semibold font-poppins text-sm hover:bg-blueBank/20"
					organisation={$organisation}>Ajouter un compte bancaire</Menu
				>
			</div>
		</div>
	{:else if $accounts}
		<AddManualTransaction
			buttonStyles="w-auto mx-5 mt-1 self-end rounded bg-blueBank/[.07] px-2 py-[3px] hover:bg-blueBank/10"
			organisation={span.parentOrganisation}
		/>
	{/if}
</div>

<style lang="postcss">
	.groupTitle {
		@apply mb-1 ml-5 text-black/40;
	}
</style>
