<script lang="ts">
	import type { Category } from '$lib/models/categories/category';
	import type { AutoEstimate } from '$lib/models/datas/auto-estimate';
	import type { Estimate } from '$lib/models/datas/estimate';
	import type { Span } from '$lib/models/spans/span';
	import { displayNumber } from '$lib/utils/Public/Helpers/displayHelpers';
	import BulletCategory from '../App-Categories/BulletCategory.svelte';
	import CellEstimate from './CellEstimate.svelte';

	export let span: Span;
	export let category: Category;
	export let cellEstimates: Estimate[];
	export let cellAutoEstimates: AutoEstimate[];
	export let onlyEstimate: Estimate | undefined;
</script>

<div class="@container">
	<div class="px-3 pb-2 pt-3">
		<div class="mb-1 text-sm text-black/50 first-letter:uppercase">
			{span.start.format('MMMM YYYY')}
		</div>
		<div class="grid grid-cols-[auto_1fr] items-center gap-2">
			<BulletCategory className="h-[8px] w-[8px] rounded-sm" type={category.type} />
			<div class="text-sm font-semibold">{category.name}</div>
		</div>
	</div>
	<div class="pb-2">
		{#if !onlyEstimate}
			{#each cellEstimates as estimate}
				<CellEstimate {estimate} />
			{/each}
		{/if}
		{#each cellAutoEstimates as autoEstimate}
			<div
				class="grid h-[28px] grid-cols-[70px_1fr] items-center border-b border-b-black/5 px-2 last:border-none"
			>
				<div class="flex h-full items-center justify-end truncate px-3 first-letter:uppercase">
					{displayNumber(autoEstimate.value, 0)}
				</div>
				<div class="truncate px-2 text-black/50">
					f(x) {autoEstimate.parentFormula.title}
				</div>
			</div>
		{/each}
	</div>
</div>
