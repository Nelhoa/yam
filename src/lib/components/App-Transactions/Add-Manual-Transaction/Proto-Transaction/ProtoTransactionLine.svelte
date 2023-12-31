<script lang="ts">
	import CustomInput from '$lib/components/Atom-CustomInput/CustomInput.svelte';

	import DatePicker from '$lib/components/Atom-CustomInput/DatePicker.svelte';
	import type { ciu } from '$lib/components/Atom-CustomInput/custom-input-utility';
	import Bin from '$lib/components/Icon/Bin.svelte';
	import Modal from '$lib/components/Layout/Modal/Modal.svelte';
	import type { ProtoTransaction } from '$lib/models/proto-transaction/proto-transaction';
	import { displayCurrency } from '$lib/utils/Public/Helpers/displayHelpers';
	import { cn } from '$lib/utils/cn';
	import { fly } from 'svelte/transition';
	import ProtoTransactionName from './ProtoTransactionName.svelte';
	import ProtoTransactionDoubles from './ProtoTransactionDoubles.svelte';

	export let protoTransaction: ProtoTransaction;
	const emptyStyles = '';
	const { date, title, manager, amount, category, error, doubles, importDespiteDoubles } =
		protoTransaction;

	function displayAmountFunction(value: ciu.Value) {
		if (typeof value === 'number') return displayCurrency(value, 'EUR');
	}

	function handleDelete() {
		manager.transactions.update((list) => list.filter((item) => item !== protoTransaction));
	}
</script>

<div
	class={cn(
		'relative grid h-[30px] w-full grid-cols-[95px_3fr_90px_auto] border-b border-b-black/5 px-4'
	)}
>
	<CustomInput
		styles="text-[14px] w-full text-right px-2"
		baseValue={amount}
		displayFunction={displayAmountFunction}
		type="number"
		buttonStyles="hover:bg-black/[.04]"
		placeHolder="Montant"
		placeHolderStyles="text-black/40"
		{emptyStyles}
		selectOnFocus
	/>
	<CustomInput
		showTooltip
		toolTipStyles="px-1 py-[1px] text-sm text-black/70"
		styles="text-left text-sm w-full  px-3"
		baseValue={title}
		type="text"
		buttonStyles="hover:bg-black/[.04]"
		{emptyStyles}
		placeHolder="Titre"
		placeHolderStyles="text-black/40"
	/>
	<DatePicker
		title="Date"
		selectNextElement
		bind:date={$date}
		buttonStyles="w-full truncate text-[13px] text-black/50 h-full border-none text-left px-1 "
	/>
	<button
		class="flex h-full items-center rounded px-2 text-black/10 hover:text-black/20 focus:text-black/20 focus:shadow focus:outline-none"
		on:click={handleDelete}
	>
		<Bin width={13} />
	</button>
	{#if $error}
		<div
			transition:fly={{ y: 4, duration: 100 }}
			class="absolute inset-0 grid grid-cols-[auto_1fr_auto_auto] items-center gap-2 bg-white px-4"
		>
			<Modal
				toolTipOnly
				toolTipStyles="p-1 px-3"
				buttonStyles="max-w-[100px] truncate text-right text-sm bg-red-200/50 rounded  font-semibold px-1"
			>
				<svelte:fragment slot="button">{$error}</svelte:fragment>
				<svelte:fragment slot="tooltip">{$error}</svelte:fragment>
			</Modal>
			<ProtoTransactionName {protoTransaction} />
			<button
				class="rounded bg-black/[.03] px-2 text-sm font-semibold hover:bg-black/5"
				on:click={() => ($error = undefined)}>Réessayer</button
			>
			<button
				class="flex h-full items-center rounded px-2 text-black/10 hover:text-black/20 focus:text-black/20 focus:shadow focus:outline-none"
				on:click={handleDelete}
			>
				<Bin width={13} />
			</button>
		</div>
	{:else if $doubles}
		<div
			transition:fly={{ y: 4, duration: 100 }}
			class={cn(
				'absolute inset-0 grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-2  bg-white px-4',
				$importDespiteDoubles && 'border-transparent bg-white'
			)}
		>
			<ProtoTransactionDoubles {protoTransaction} />
			<ProtoTransactionName {protoTransaction} />
			<button
				class="rounded bg-black/[.03] px-2 text-sm font-semibold hover:bg-black/5"
				on:click={() => ($doubles = undefined)}>Éditer</button
			>
			<button
				class={cn(
					'rounded border border-yellow-500/60 bg-white px-2 text-sm font-semibold ',
					$importDespiteDoubles && 'bg-yellow-500 text-white'
				)}
				on:click={() => ($importDespiteDoubles = !$importDespiteDoubles)}
				>{$importDespiteDoubles ? 'Import' : 'Importer ?'}</button
			>

			<button
				class="flex h-full items-center rounded px-2 text-black/10 hover:text-black/20 focus:text-black/20 focus:shadow focus:outline-none"
				on:click={handleDelete}
			>
				<Bin width={13} />
			</button>
		</div>
	{/if}
</div>
