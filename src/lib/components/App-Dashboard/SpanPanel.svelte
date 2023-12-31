<script lang="ts">
	import EstimatesList from '$lib/components/App-Estimates/EstimatesList.svelte';
	import FormulasList from '$lib/components/App-Formulas/FormulasList.svelte';
	import type { Span } from '$lib/models/spans/span';
	import { fly } from 'svelte/transition';
	import SpanTransactions from '$lib/components/App-Transactions/SpanTransactions.svelte';
	import type { Organisation } from '$lib/models/structurals/organisation';
	import SpanPanelHeader from './SpanPanelHeader.svelte';
	import Categories from '$lib/components/App-Categories/CategoriesList.svelte';
	import type { Formula } from '$lib/models/formulas/formula';
	import SpanCategories from '$lib/components/App-CategoriesChart/SpanCategories.svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import CommitsPanel from '../App-Commits/CommitsPanel.svelte';

	type panels = 'estimates' | 'transactions' | 'formulas' | 'categories' | 'stats' | 'commits';

	export let organisation: Organisation;
	export let selectedSpan: Span | undefined;
	let selectedFormula: Formula | undefined;
	let selectedPanel: panels = ($page.url.searchParams.get('panel') as panels) ?? 'estimates';
	let isEditing = false;
	$: changePanelUrl(selectedPanel);

	function changePanelUrl(newValue: string) {
		$page.url.searchParams.set('panel', newValue);
		goto($page.url);
	}

	function goToFormula(event: CustomEvent) {
		selectedPanel = 'formulas';
		selectedFormula = event.detail.formula;
		isEditing = true;
	}
</script>

{#if selectedSpan}
	<div class="grid h-full grid-rows-[auto_auto_1fr]">
		{#key selectedSpan}
			<div in:fly|local={{ x: 10 }}>
				<SpanPanelHeader span={selectedSpan} />
			</div>
		{/key}
		<div class="flex w-full overflow-x-auto shadow-lg shadow-blueBank/5">
			<button
				class="tab"
				class:tabSelected={selectedPanel === 'estimates'}
				on:click={() => (selectedPanel = 'estimates')}>Estimés</button
			>
			<button
				class="tab"
				class:tabSelected={selectedPanel === 'transactions'}
				on:click={() => (selectedPanel = 'transactions')}>Transactions</button
			>
			<button
				class="tab"
				class:tabSelected={selectedPanel === 'commits'}
				on:click={() => (selectedPanel = 'commits')}>Engagés</button
			>
			<button
				class="tab"
				class:tabSelected={selectedPanel === 'stats'}
				on:click={() => (selectedPanel = 'stats')}>Stats</button
			>
			<button
				class="tab"
				class:tabSelected={selectedPanel === 'categories'}
				on:click={() => (selectedPanel = 'categories')}>Catégories</button
			>
			<button
				class="tab"
				class:tabSelected={selectedPanel === 'formulas'}
				on:click={() => {
					selectedPanel = 'formulas';
					isEditing = false;
				}}>Formules</button
			>
		</div>

		<div class="overflow-y-auto pb-12">
			{#key selectedSpan}
				<div in:fly|local={{ x: 10 }}>
					{#if selectedSpan && selectedPanel === 'estimates'}
						<div in:fly|local={{ x: 10 }}>
							{#key selectedSpan}
								<EstimatesList span={selectedSpan} on:goToFormula={goToFormula} />
							{/key}
						</div>
					{:else if selectedPanel === 'transactions' && selectedSpan}
						<div in:fly|local={{ x: 10 }}>
							{#key selectedSpan}
								<SpanTransactions span={selectedSpan} />
							{/key}
						</div>
					{:else if selectedPanel === 'commits' && selectedSpan}
						<div in:fly|local={{ x: 10 }}>
							{#key selectedSpan}
								<CommitsPanel span={selectedSpan} />
							{/key}
						</div>
					{:else if selectedPanel === 'stats' && selectedSpan}
						<div in:fly|local={{ x: 10 }}>
							{#key selectedSpan}
								<SpanCategories span={selectedSpan} />
							{/key}
						</div>
					{/if}
				</div>
			{/key}
			{#if selectedPanel === 'formulas'}
				<div in:fly|local={{ x: 10 }}>
					<FormulasList {organisation} bind:selectedFormula bind:isEditing />
				</div>
			{/if}
			{#if selectedPanel === 'categories'}
				<div in:fly|local={{ x: 10 }}>
					<Categories {organisation} />
				</div>
			{/if}
		</div>
	</div>
{/if}

<style lang="postcss">
	.tab {
		@apply border-b border-r  border-b-transparent border-r-blueBank/10 px-4 py-[2px] text-black/70 last:border-r-transparent hover:bg-blueBank/5;
	}
	.tabSelected {
		@apply border-b-blueBank border-r-transparent bg-blueBank/5 text-black;
	}
</style>
