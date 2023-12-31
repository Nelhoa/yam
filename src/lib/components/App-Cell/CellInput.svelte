<script lang="ts">
	import type { Category } from '$lib/models/categories/category';
	import type { Estimate } from '$lib/models/datas/estimate';
	import type { Span } from '$lib/models/spans/span';
	import { createEventDispatcher } from 'svelte';

	export let span: Span;
	export let onlyEstimate: Estimate | undefined;
	export let newEstimateValue: number | null;
	export let category: Category;

	const dispatch = createEventDispatcher();
	const closeModal = () => dispatch('close');
	let newEstimateInputElement: HTMLInputElement | undefined;

	function handleInputKeyDown(event: KeyboardEvent) {
		if (event.key !== 'Enter') return;
		if (!onlyEstimate) return createFirstEstimate();
		modifyOnlyEstimateValue();
	}

	function createFirstEstimate() {
		if (typeof newEstimateValue !== 'number') {
			closeModal();
			return;
		}
		span.estimatesManager.newEstimate(
			{
				value: newEstimateValue,
				core_category: category.getCoreCategoryId(),
				custom_category_id: category.getCustomCategoryId()
			},
			category
		);
		newEstimateValue = null;
		closeModal();
	}

	function modifyOnlyEstimateValue() {
		if (!onlyEstimate) return;
		if (newEstimateValue === 0 || !newEstimateValue) {
			onlyEstimate.delete();
			closeModal();
			return;
		}

		if (typeof newEstimateValue === 'number') {
			onlyEstimate.updateValue(newEstimateValue);
			newEstimateValue = null;
			closeModal();
			return;
		}
	}

	$: if (newEstimateInputElement) {
		newEstimateInputElement.focus();
		newEstimateInputElement.select();
	}
</script>

<div class="h-full w-full last:border-none">
	<input
		on:keydown={handleInputKeyDown}
		type="number"
		bind:value={newEstimateValue}
		bind:this={newEstimateInputElement}
		placeholder="Valeur"
		class="decoration-none nospin h-full w-full text-center text-sm focus:outline-none"
	/>
</div>
