<script lang="ts">
	import type { Organisation } from '$lib/models/structurals/organisation';
	import { fly, slide } from 'svelte/transition';
	import AddCategory from './AddCategory.svelte';
	import CategoryLine from './CategoryLine.svelte';
	import { CoreCategory } from '$lib/models/categories/category-core';

	export let organisation: Organisation;
	const categories = organisation.categoriesManager.categories;
	const categoriesGroup: { type: 'income' | 'outcome' | 'key'; title: string }[] = [
		{ type: 'income', title: 'Encaissements' },
		{ type: 'outcome', title: 'Décaissements' },
		{ type: 'key', title: 'Indicateurs Clés' }
	];
</script>

<div class="mt-5">
	<div>
		{#each categoriesGroup as group (group.type)}
			{@const categories = [...$categories].filter((category) => category.type === group.type)}
			<div class="mb-4 px-8 flex flex-col gap-1">
				<div class="groupTitle">{group.title}</div>

				{#each categories as category}
					<div in:slide|local>
						<CategoryLine {category} />
					</div>
				{/each}
				<AddCategory {organisation} type={group.type} />
			</div>
		{/each}
	</div>
</div>

<style lang="postcss">
	.groupTitle {
		@apply text-black/40 mb-2;
	}
</style>
