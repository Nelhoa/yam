<script lang="ts">
	import type { Scenario } from '$lib/models/scenario/scenario';
	import type { Category } from '$lib/models/categories/category';
	import _ from 'lodash';
	import BulletCategory from '../App-Categories/BulletCategory.svelte';
	type Doc = { title: string; text: string; id: string | number; category?: Category };

	export let scenario: Scenario;
	let selectedDoc: Doc | undefined;
	let docs: Doc[] = [];
	const categoriesDoc = _.sortBy(
		[...scenario.parentOrganisation.categoriesMap],
		([key, category]) => category.type
	).reduce(
		(previous, [key, category]) => [
			...previous,
			{
				title: category.name,
				text: `Vous pouvez reférencer la catégorie <span class="font-semibold">${
					category.name
				}</span> en utilisant son identifiant <span class="font-semibold">${JSON.stringify(
					category.identifier
				)}</span> dans une fonction permettant d’accéder à ses valeurs. impact(identifiant, décalage de temps) `,
				id: category.identifier,
				category
			}
		],
		[] as Doc[]
	);
	docs = [...docs, ...categoriesDoc];
	selectedDoc = docs[0];
</script>

<div class="grid grid-cols-[135px_1fr] h-[250px] max-h-[250px]">
	<div class="w-full h-full overflow-y-scroll">
		<!-- <div class="truncate text-lg text-black/80 mb-3">Catégories</div> -->
		<div class="flex flex-col gap-y-1">
			{#each docs as doc}
				<button
					on:click={() => (selectedDoc = doc)}
					class="grid items-center  gap-x-2 grid-cols-[auto_1fr] truncate w-full text-left bg-blueBank/5 text-black/40 hover:text-black focus:outline-none focus:bg-blueBank/20 hover:bg-blueBank/10  px-2 py-[2px] rounded shadow-sm shadow-blueBank/20"
					class:selected={selectedDoc === doc}
				>
					<BulletCategory className="w-[7px] h-[7px] rounded-sm" type={doc.category?.type} />
					<div class="truncate">
						{doc.title}
					</div>
				</button>
			{/each}
		</div>
	</div>
	<div class="p-2 bg-white rounded shadow-sm shadow-blueBank/20">
		{#if selectedDoc}
			<div class="text-lg font-semibold mb-1">{selectedDoc?.title}</div>
			<div>{@html selectedDoc?.text}</div>
		{/if}
	</div>
</div>

<style lang="postcss">
	.selected {
		@apply bg-white text-black;
	}
</style>
