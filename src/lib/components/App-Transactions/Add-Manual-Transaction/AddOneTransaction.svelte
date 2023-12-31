<script lang="ts">
	import AccountSelector from '$lib/components/Atom-CustomInput/AccountSelector.svelte';
	import CategorySelector from '$lib/components/Atom-CustomInput/CategorySelector.svelte';
	import DatePicker from '$lib/components/Atom-CustomInput/DatePicker.svelte';
	import { ManualAccount } from '$lib/models/banks/account-manual';
	import type { Organisation } from '$lib/models/structurals/organisation';
	import { createEventDispatcher } from 'svelte';
	import { get } from 'svelte/store';
	import CustomInput from '$lib/components/Atom-CustomInput/CustomInput.svelte';
	import { displayCurrency } from '$lib/utils/Public/Helpers/displayHelpers';
	import { ProtoTransactionManager } from '$lib/models/proto-transaction/proto-transaction-manager';
	import { ProtoTransaction } from '$lib/models/proto-transaction/proto-transaction';
	import ProtoTransactionDoubles from './Proto-Transaction/ProtoTransactionDoubles.svelte';
	import ProtoTransactionName from './Proto-Transaction/ProtoTransactionName.svelte';
	import Loader from '$lib/components/Icon/Loader.svelte';
	import { cn } from '$lib/utils/cn';
	import { openLimitMenu } from '$lib/components/App-Limits/util-limit';
	import LimitLocker from '$lib/components/App-Limits/LimitLocker.svelte';
	const dispatch = createEventDispatcher();

	export let organisation: Organisation;
	let loading = false;
	const manager = new ProtoTransactionManager(organisation);
	const protoTransaction = new ProtoTransaction(manager, {});
	const { account } = manager;
	const { date, amount, category, title, error, doubles, importDespiteDoubles } = protoTransaction;
	manager.setAccount(get(organisation.accounts).find((item) => item instanceof ManualAccount));
	const accountLimitExceeded = manager.organisation.limits.accountLimitExceeded;
	const manualAccountLimitExceeded = manager.organisation.limits.manualAccountLimitExceeded;
	const bankLimitExceeded = manager.organisation.limits.bankLimitExceeded;
	$: limitExceeded =
		$account instanceof ManualAccount
			? $manualAccountLimitExceeded
			: $bankLimitExceeded || $accountLimitExceeded;

	function handleSelectCategory(event: CustomEvent) {
		category.set(event.detail.category);
	}

	async function addTransaction() {
		//Check limits before to run import
		if ($account instanceof ManualAccount) {
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
		loading = true;
		$error = undefined;
		if ($doubles) $importDespiteDoubles = true;
		const success = await protoTransaction.import('solo');
		loading = false;
		if (success) dispatch('close');
	}

	async function switchToMultiple() {
		dispatch('switch');
	}

	function displayAmount(value: any) {
		return displayCurrency(value, 'EUR');
	}
</script>

<div class="@container">
	<div class="mb-3">
		<div class="text-[17px] font-semibold">Créer une transaction</div>

		{#if $error}
			<div class="mt-1 text-sm font-semibold text-red-500">{$error}</div>
		{/if}
	</div>
	<div class="relative grid grid-cols-1 gap-[6px] gap-x-3 @sm:grid-cols-2">
		<div class="@sm:col-span-2">
			<div class="label">Titre</div>
			<CustomInput
				focus
				baseValue={title}
				type="text"
				placeHolder={'Titre'}
				styles="text-black border rounded h-[30px] w-full text-left"
				placeHolderStyles="text-black/60"
			/>
		</div>
		<div>
			<div class="label">Catégorie</div>
			<CategorySelector
				mode="flip"
				buttonStyles="text-black border rounded h-[30px]"
				selectedCategory={$category}
				noKeyType
				{organisation}
				on:select={handleSelectCategory}
			/>
		</div>
		<div>
			<div class="label">Compte bancaire</div>
			<AccountSelector
				buttonStyles="text-black border rounded h-[30px]"
				{organisation}
				manualOnly
				bind:selectedAccount={$account}
			/>
		</div>
		<div>
			<div class="label">Date</div>
			<DatePicker selectNextElement bind:date={$date} buttonStyles="h-[30px] w-full text-left" />
		</div>
		<div>
			<div class="label">Montant</div>
			<CustomInput
				baseValue={amount}
				type="number"
				displayFunction={displayAmount}
				placeHolder={'Montant'}
				styles={cn(
					'text-black border rounded h-[30px] w-full text-left',
					$amount && $amount < 0 && 'border-orange-600/70'
				)}
				placeHolderStyles="text-black/60"
			/>
		</div>

		{#if $amount && $amount < 0}
			<div class="mt-1 text-sm font-semibold text-orange-600 text-balance @sm:col-span-2">
				Attention, vous vous apprêter à créer une transaction inversée.
			</div>
		{/if}

		{#if $doubles}
			<div
				class="absolute inset-0 flex flex-col items-center justify-center gap-y-2 rounded border-2 border-yellow-200/50 bg-white p-3"
			>
				<ProtoTransactionName {protoTransaction} styles="text-[15px]" />
				<ProtoTransactionDoubles {protoTransaction} styles="px-3 text-[15px] max-w-full" />
				<button
					class="mt-3 rounded border border-black/5 bg-white px-3 shadow hover:bg-black/10"
					on:click={() => ($doubles = undefined)}>Modifier la transaction</button
				>
			</div>
		{/if}
	</div>
	<div class="mt-3 flex flex-col items-center">
		<button
			disabled={loading}
			class={cn(
				'mt-2 h-[30px] w-full rounded bg-blueBank font-semibold text-white focus:shadow-md focus:outline-1 focus:outline-blueBank20 disabled:bg-blueBank/50',
				$doubles && 'bg-yellow-500'
			)}
			on:click={addTransaction}
		>
			{#if loading}
				<div class="flex w-full items-center justify-center">
					<Loader width={45} />
				</div>
			{:else}
				{$doubles ? 'Importer quand même' : 'Créer la transaction'}
			{/if}
			<LimitLocker locked={limitExceeded} />
		</button>
		<button
			disabled={loading}
			class="mt-3 h-[30px] rounded px-4 text-[15px] text-black/60 hover:bg-black/5"
			on:click={switchToMultiple}>Création multiple</button
		>
	</div>
</div>

<style lang="postcss">
	.label {
		@apply mb-[2px] text-[12px] font-semibold text-black/60;
	}
</style>
