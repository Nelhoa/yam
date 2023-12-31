<script lang="ts">
	import type { Formula } from '$lib/models/formulas/formula';
	import type { Organisation } from '$lib/models/structurals/organisation';
	import { newAlert } from '$lib/stores/alerts-store';
	import { fly } from 'svelte/transition';
	import FormulaExpressionEditor from './FormulaExpressionEditor.svelte';
	import type { Category } from '$lib/models/categories/category';
	import FormulaDocumentation from './FormulaDocumentation.svelte';
	import CategorySelector from '../Atom-CustomInput/CategorySelector.svelte';

	export let organisation: Organisation;
	export let formula: Formula | undefined = undefined;
	export let isEditing: boolean;
	let category = formula?.category ?? undefined;
	let title = formula ? formula.title : '';
	let expression = formula?.expression ?? '';
	let expressionError = false;
	let loading = false;
	let minOffset = 0;
	let maxOffset = 0;
	let checkedCategories: Category[] = [];
	let titleInputElement: HTMLInputElement | undefined;
	$: selectedScenario = organisation.selectedScenario;
	$: isSavable = category && title.length > 0 && expression.length > 0 && !expressionError;

	function quitEditMode() {
		isEditing = false;
	}

	$: if (titleInputElement) titleInputElement.focus();

	function save() {
		if (formula) return modifyFormula();
		createFormula();
	}

	async function modifyFormula() {
		if (!formula) return;
		if (
			formula.category === category &&
			formula.title === title &&
			formula.expression === expression
		)
			return quitEditMode();
		if (!category || !title || !expression || expressionError)
			return newAlert('Remplissez tous les champs');
		loading = true;
		await formula.update(category, title, expression, { minOffset, maxOffset, checkedCategories });
		quitEditMode();
		loading = false;
	}

	async function createFormula() {
		loading = true;
		if (!category || !title || !expression || expressionError)
			return newAlert('Remplissez tous les champs');
		await $selectedScenario.formulasManager.newFormula(category, title, expression);
		quitEditMode();
		loading = false;
	}

	function handleCategorySelect(e: CustomEvent) {
		category = e.detail.category as Category;
	}
</script>

<div in:fly={{ x: 10 }}>
	<div class="rounded px-5">
		<!-- <div class="text-black/50">
			{formula ? 'Modifier une formule' : 'Créer une formule'}
		</div> -->
		<div class="mb-4 mt-1 flex flex-col gap-y-2">
			<input
				type="text"
				id="title"
				placeholder="Titre de la formule"
				class="rounded bg-white px-3 py-[2px] font-semibold shadow shadow-blueBank/5 focus:shadow-blueBank/20 focus:outline-none"
				bind:value={title}
				bind:this={titleInputElement}
			/>
			<div class="h-[30px] rounded bg-white shadow shadow-blueBank/5 hover:shadow-blueBank/20">
				<CategorySelector
					{organisation}
					selectedCategory={category}
					on:select={handleCategorySelect}
				/>
			</div>

			<label class="-mb-1 text-black/50" for="expression">Formule</label>
			{#key category}
				<FormulaExpressionEditor
					scenario={$selectedScenario}
					bind:expression
					bind:error={expressionError}
					bind:minimumOffset={minOffset}
					bind:maximumOffset={maxOffset}
					bind:categoriesInExpression={checkedCategories}
					{category}
					bind:formula
				/>
			{/key}
		</div>
		<div class="flex items-center justify-end gap-x-3">
			<button class="rounded bg-black/5 px-3 py-[2px]" on:click={quitEditMode}>Annuler</button>
			<button
				class="rounded bg-blueBank px-3 py-[2px] font-semibold text-white disabled:bg-blueBank/30"
				on:click={save}
				disabled={!isSavable || loading}>{formula ? 'Sauvegarder' : 'Créer'}</button
			>
		</div>
	</div>
	<div class="mx-5 mt-4">
		<FormulaDocumentation scenario={$selectedScenario} />
	</div>
</div>
