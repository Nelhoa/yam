<script lang="ts">
	import type { Category } from '$lib/models/categories/category';
	import type { Scenario } from '$lib/models/scenario/scenario';
	import { displayNumber } from '$lib/utils/Public/Helpers/displayHelpers';
	import type { Formula } from '$lib/models/formulas/formula';
	import { organisation } from '$lib/stores/organisations-store';

	export let scenario: Scenario;
	export let expression: string;
	export let category: Category | undefined = undefined;
	export let formula: Formula | undefined = undefined;
	export let error = false;
	export let categoriesInExpression: Category[] = [];
	export let minimumOffset: number = 0;
	export let maximumOffset: number = 0;
	$: selectedSpan = $organisation?.selectedSpan;
	$: if ($selectedSpan) compute();

	let result: string | number | null = 0;
	compute();

	function compute() {
		const {
			result: computeResult,
			computeError,
			checkedCategories,
			minOffset,
			maxOffset
		} = scenario.formulaParser.getFormulaParsedInfos(expression, category, formula, $selectedSpan);

		categoriesInExpression = checkedCategories;
		minimumOffset = minOffset;
		maximumOffset = maxOffset;
		result = computeResult;
		error = computeError;
	}
</script>

<div class="w-full">
	<textarea
		bind:value={expression}
		on:input={compute}
		spellcheck="false"
		class="bg-whiterounded h-[110px] w-full rounded px-3 py-[2px] font-mono outline-blueBank focus:shadow focus:outline-2"
		class:hasError={error}
	/>
	<div class="rounded bg-white/40 px-2 py-[2px]">
		{#if error}
			<span class="font-semibold text-red-600">Erreur :</span>
			<span>{@html result}</span>
		{:else}
			<span class="font-semibold text-black/90">Résultat :</span>
			<span>{displayNumber(result)}</span>
		{/if}
	</div>
</div>

<style lang="postcss">
	.hasError {
		@apply outline outline-2 outline-red-500;
	}
</style>
