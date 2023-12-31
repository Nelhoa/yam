<script lang="ts">
	import AccountSelector from '$lib/components/Atom-CustomInput/AccountSelector.svelte';
	import type { ProtoTransaction } from '$lib/models/proto-transaction/proto-transaction';
	import { ProtoTransactionManager } from '$lib/models/proto-transaction/proto-transaction-manager';
	import type { Organisation } from '$lib/models/structurals/organisation';
	import { fly, slide } from 'svelte/transition';
	const dispatch = createEventDispatcher();

	const isImporting = false;
	const outanimation = isImporting ? fly : slide;

	import ImportTransactionByCsv from './ImportTransactionByCSV.svelte';
	import ProtoTransactionLine from './Proto-Transaction/ProtoTransactionLine.svelte';
	import type { Account } from '$lib/models/banks/account';
	import Loader from '$lib/components/Icon/Loader.svelte';
	import { cn } from '$lib/utils/cn';
	import { createEventDispatcher } from 'svelte';
	import { ManualAccount } from '$lib/models/banks/account-manual';
	import { PUBLIC_SITE_TITLE } from '$env/static/public';
	import { openLimitMenu } from '$lib/components/App-Limits/util-limit';
	import LimitLocker from '$lib/components/App-Limits/LimitLocker.svelte';

	export let organisation: Organisation;
	export let account: Account | undefined = undefined;
	export let accountDisabled = false;
	const manager = new ProtoTransactionManager(organisation);

	if (account) manager.setAccount(account);
	$: transactions = manager.transactions;
	$: selectedAccount = manager.account;
	$: isImportLoading = manager.importLoading;
	$: importedTransactions = manager.importedTransactions;

	const accountLimitExceeded = manager.organisation.limits.accountLimitExceeded;
	const manualAccountLimitExceeded = manager.organisation.limits.manualAccountLimitExceeded;
	const bankLimitExceeded = manager.organisation.limits.bankLimitExceeded;
	$: limitExceeded =
		$selectedAccount instanceof ManualAccount
			? $manualAccountLimitExceeded
			: $bankLimitExceeded || $accountLimitExceeded;

	function handleImport(event: CustomEvent) {
		const protoTransactions = event.detail.protoTransactions as ProtoTransaction[] | undefined;
		if (!protoTransactions) return;
		manager.addTransactions(protoTransactions);
	}

	function handleAdd() {
		manager.addBlank();
	}

	function handleAccountSelect(e: CustomEvent) {
		$selectedAccount = e.detail.account;
	}

	async function importTransactions() {
		//Check limits before to run import
		if ($selectedAccount instanceof ManualAccount) {
			if ($manualAccountLimitExceeded) {
				dispatch('close');
				return openLimitMenu('manualAccountOverLimit');
			}
		} else {
			if ($bankLimitExceeded) {
				dispatch('close');
				return openLimitMenu('bankOverLimit');
			}
			if ($accountLimitExceeded) {
				dispatch('close');
				return openLimitMenu('accountOverLimit');
			}
		}
		await manager.importAll();
		if ($transactions.length === 0) dispatch('close');
	}
</script>

<div class=" px-4 pt-4">
	<div class="mb-2 text-[17px] font-semibold">Ajouter des transactions</div>
	<div class=" grid grid-cols-2 items-center">
		<div class="mb-2 mt-2 text-sm font-semibold text-black/70">Dans le compte</div>
		{#if $importedTransactions.length > 0}
			<div in:fly={{ y: 10 }} class="flex items-center justify-end gap-2 text-sm font-semibold">
				Transactions importées
				{#key $importedTransactions}
					<div class="rounded bg-blueBank px-2 font-semibold text-white" in:fly={{ y: 10 }}>
						{$importedTransactions.length}
					</div>
				{/key}
			</div>
		{/if}
	</div>
	<AccountSelector
		on:select={handleAccountSelect}
		disabled={accountDisabled}
		buttonStyles="mb-3 border border-black/5 rounded py-[2px]"
		selectedAccount={$selectedAccount}
		{organisation}
	/>
</div>

{#if $selectedAccount && !($selectedAccount instanceof ManualAccount)}
	<div class="my-2 px-5 text-[15px] text-black/60 text-balance">
		Attention. Vous vous apprêter à importer des transactions sur un compte synchronisé
		automatiquement. {PUBLIC_SITE_TITLE} procède à une vérification des doublons avant import.
	</div>
{/if}

<div class="mt-5 flex max-h-[50vh] w-full flex-col justify-stretch overflow-y-auto">
	{#if $transactions.length > 0}
		<div class="mb-3">
			{#each $transactions as protoTransaction, i (protoTransaction)}
				<div
					class="border-black/5 first-of-type:border-t"
					out:outanimation
					in:fly|global={{ y: 10 }}
				>
					<ProtoTransactionLine {protoTransaction} />
				</div>
			{/each}
		</div>
	{/if}
</div>

<div class="flex flex-wrap justify-between gap-3 px-4 pb-4 pt-2">
	<div class="flex flex-wrap gap-3">
		<button
			class="rounded bg-black/5 px-2 py-[2px] text-[15px] hover:bg-black/10 focus:shadow focus:outline-none"
			on:click={handleAdd}>+ Ajouter</button
		>
		<ImportTransactionByCsv
			buttonStyles="px-2 text-[15px] bg-black/5 hover:bg-black/10 rounded py-[2px] focus:outline-none focus:shadow"
			{manager}
			on:add={handleImport}
		/>
	</div>
	<button
		disabled={$isImportLoading || !$selectedAccount || $transactions.length === 0}
		class={cn(
			'flex h-[28px] items-center rounded bg-blueBank/80 px-3 py-[2px] font-semibold text-white hover:bg-blueBank',
			'disabled:bg-blueBank/40 disabled:hover:bg-blueBank/40'
		)}
		on:click={importTransactions}
	>
		{#if $isImportLoading}
			<Loader width={45} />
		{:else}
			Importer
		{/if}
		<LimitLocker locked={$selectedAccount && limitExceeded} />
	</button>
</div>
