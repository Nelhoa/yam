<script lang="ts">
	import Modal from '$lib/components/Layout/Modal/Modal.svelte';
	import type { Category } from '$lib/models/categories/category';
	import type { Span } from '$lib/models/spans/span';
	import { displayNumber } from '$lib/utils/Public/Helpers/displayHelpers';
	import { get } from 'svelte/store';
	import Loader from '../Icon/Loader.svelte';
	import CellModal from './CellModal.svelte';
	import CellInput from './CellInput.svelte';
	import type { ModalElement } from '../Layout/Modal/util-modal';
	export let span: Span;
	export let category: Category;

	$: estimates = span.estimatesManager.estimates;
	$: autoEstimates = span.autoEstimatesManager.autoEstimates;
	$: cellEstimates = $estimates?.filter((item) => get(item.category) === category) ?? [];
	$: cellAutoEstimates = $autoEstimates?.filter((item) => item.category === category) ?? [];
	$: cellTransactions = span.transactionsManager.transactions;
	$: cells = span.cellsMap;
	$: cell = $cells.get(category);

	let newEstimateValue: number | null = null;
	let CellModalElement: ModalElement;
	$: isModalVisible = CellModalElement?.isVisible;

	$: onlyEstimate =
		cellEstimates.length === 1 && cellAutoEstimates.length === 0 ? cellEstimates[0] : undefined;
	$: {
		$isModalVisible;
		if (onlyEstimate) setNewEstimateValue();
	}

	$: if ($isModalVisible) span.estimatesManager.loadEstimates();

	function setNewEstimateValue() {
		newEstimateValue = onlyEstimate?.info.value ?? null;
	}

	function handleKeydown(event: KeyboardEvent) {
		if (!$isModalVisible) return;
		if (event.key === 'Delete') deleteOnlyEstimate();
	}

	function deleteOnlyEstimate() {
		if (onlyEstimate) {
			onlyEstimate.delete();
			newEstimateValue = null;
			CellModalElement?.close();
			return;
		}
		if (!onlyEstimate) {
			newEstimateValue = null;
			CellModalElement?.close();
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

<Modal
	bind:Modal={CellModalElement}
	buttonStyles={'h-full w-full'}
	modalStyles="w-[200px] max-w-[90vw]"
>
	<button
		slot="button"
		class="flex h-full w-full items-center justify-center"
		class:isModalVisible={$isModalVisible}
		class:isPast={!span.isPresentOrFuturSpan && !isModalVisible}
		class:isPresent={span.isPresentOrFuturSpan && !isModalVisible}
	>
		{#if $isModalVisible}
			{#if !$estimates}
				<div class="text-blueBank/40">
					<Loader width={40} />
				</div>
			{:else if (cellEstimates.length === 0 || onlyEstimate) && cellAutoEstimates.length === 0}
				<CellInput
					{span}
					{onlyEstimate}
					bind:newEstimateValue
					{category}
					on:close={() => CellModalElement?.close()}
				/>
			{:else if cell}
				{cell?.impact !== 0 ? displayNumber(cell.impact) : ''}
			{/if}
		{:else if cell}
			{cell?.impact !== 0 ? displayNumber(cell.impact) : ''}
		{:else}
			{''}
		{/if}
	</button>
	<svelte:fragment slot="menu">
		<CellModal {span} {category} {onlyEstimate} {cellAutoEstimates} {cellEstimates} />
	</svelte:fragment>
</Modal>

<style lang="postcss">
	.isModalVisible {
		@apply rounded-sm bg-white/70 text-black shadow-md shadow-blueBank/20 outline outline-1 outline-blueBank/30;
	}
	.isPast {
		@apply text-black/30 hover:text-black;
	}

	.isPresent {
		@apply bg-white/30 text-black/[.75];
	}
</style>
