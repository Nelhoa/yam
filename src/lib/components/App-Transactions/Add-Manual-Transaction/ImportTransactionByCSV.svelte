<script lang="ts">
	import Markdown from '$lib/components/Layout/Markdown.svelte';
	import Modal from '$lib/components/Layout/Modal/Modal.svelte';
	import ReadCsv from '$lib/components/Layout/ReadCSV.svelte';
	import { createEventDispatcher } from 'svelte';
	import { createProtoTransactionFromCSV } from './create-proto-transaction-from-csv';
	import type { ProtoTransactionManager } from '$lib/models/proto-transaction/proto-transaction-manager';
	import type { ProtoTransaction } from '$lib/models/proto-transaction/proto-transaction';
	import { get } from 'svelte/store';
	import { displayCurrency } from '$lib/utils/Public/Helpers/displayHelpers';
	import _ from 'lodash';
	import { cn } from '$lib/utils/cn';
	import type { ModalElement } from '$lib/components/Layout/Modal/util-modal';

	const dispatch = createEventDispatcher();
	export let manager: ProtoTransactionManager;
	export let buttonStyles = '';
	let CSVImportModal: ModalElement;
	let datas: unknown | undefined;
	let error: null | string;
	let protoTransactions: ProtoTransaction[] | undefined;

	$: if (datas) parse(datas);

	const textHelper = `Ajouter des transactions avec un CSV
Veillez à avoir uniquement trois colonnes avec les en-têtes :
- **amount** : représente le montant de la transaction
- **title** : représente le titre de la transaction
- **date** : représente la date de la transaction, au format YYYY-MM-DD, par exemple pour une transaction du 23 novembre 2023 : 2023-11-23
    `;

	function handleImport() {
		if (!protoTransactions || protoTransactions.length === 0) return;
		CSVImportModal?.close();
		dispatch('add', { protoTransactions });
		restart();
	}

	function parse(datas: unknown) {
		const { error: parseError, protoTransactions: items } = createProtoTransactionFromCSV(
			datas,
			manager
		);
		protoTransactions = items;
		error = parseError;
	}

	function restart() {
		datas = undefined;
		error = null;
		protoTransactions = undefined;
	}
</script>

<Modal
	bind:Modal={CSVImportModal}
	modalStyles="max-w-[90vw] w-[300px] p-3"
	buttonStyles={cn('', buttonStyles)}
>
	<svelte:fragment slot="button">+ depuis un CSV</svelte:fragment>
	<svelte:fragment slot="menu">
		<div class="mb-3 font-semibold">Import par CSV</div>
		{#if protoTransactions && protoTransactions.length > 0}
			<div class="mb-1 rounded bg-green-500/10 px-3 py-[2px] text-sm font-semibold text-black/80">
				{protoTransactions.length} transaction(s) trouvée(s)
			</div>
			<div class="my-3 grid max-h-[150px] grid-cols-3 gap-1 overflow-y-auto py-1">
				{#each _.sortBy( protoTransactions, (item) => get(item.date)?.format('YYYY-MM-DD') ) as transaction}
					<div class="truncate text-sm text-black/80">
						{get(transaction.date)?.format('Do MMM YYYY')}
					</div>
					<div class="truncate text-sm text-black/80">
						{get(transaction.title)}
					</div>
					<div class="truncate text-sm text-black/80">
						{displayCurrency(get(transaction.amount), 'EUR')}
					</div>
				{/each}
			</div>

			{#if error}
				<div class="mb-3 text-sm">
					{error}
				</div>
			{/if}

			<button
				class="w-full rounded bg-blueBank/80 py-[2px] font-semibold text-white hover:bg-blueBank focus:outline-none disabled:bg-blueBank/20"
				disabled={!protoTransactions}
				on:click={handleImport}>Ajouter</button
			>
			<button
				class="mt-2 w-full rounded bg-black/5 py-[2px] font-semibold hover:bg-black/10 focus:outline-none disabled:bg-blueBank/20"
				on:click={restart}>Recommencer</button
			>
		{:else if error}
			<div class="mb-1 rounded bg-red-500/10 px-3 py-[2px] text-sm font-semibold text-black/80">
				Aucune transaction trouvée
			</div>
			<div class="mb-3 text-sm">
				{error}
			</div>
			<button
				class="w-full rounded bg-black/5 py-[2px] font-semibold hover:bg-black/10 focus:outline-none disabled:bg-blueBank/20"
				on:click={restart}>Recommencer</button
			>
		{:else}
			<ReadCsv bind:datas />
			<div class="my-3 text-sm opacity-75">
				<Markdown content={textHelper}></Markdown>
			</div>
		{/if}
	</svelte:fragment>
</Modal>
