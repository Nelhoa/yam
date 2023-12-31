<script lang="ts">
	import type { Span } from '$lib/models/spans/span';
	import CategoriesChart from './CategoriesChart.svelte';
	// import Accordion from '$lib/components/Atom-Accordion/accordion.svelte';

	export let span: Span;
	const cellsMap = span.cellsMap;
</script>

{#if [...$cellsMap].filter(([key, value]) => ['income', 'outcome'].includes(key.type)).length > 0}
	{#key $cellsMap}
		<div class="p-4">
			<CategoriesChart {span} />
		</div>
	{/key}
{/if}

<!-- <div class="p-5">
	<Accordion let:AccordionItem colapse>
		<AccordionItem>
			<svelte:fragment slot="title">Vive Le Vent</svelte:fragment>
			<svelte:fragment slot="content">Vive les Poney</svelte:fragment>
		</AccordionItem>
		<AccordionItem>
			<svelte:fragment slot="title">J’adore les pates</svelte:fragment>
			<svelte:fragment slot="content">Eh oui, c’est vrai, j’adore ça !</svelte:fragment>
		</AccordionItem>
	</Accordion>
</div> -->
