<script lang="ts">
	import { derived } from 'svelte/store';
	import BaseCell from './BaseCell.svelte';
	import type { Game } from '$lib/models/yam';
	import { fly } from 'svelte/transition';
	import type { CellsGroup } from '$lib/models/Cells';
	import type { Grid } from '$lib/models/yam';

	export let cellsGroup: CellsGroup;
	export let grid: Grid;
	$: subtotal = derived(
		cellsGroup.cells.map((i) => i.score),
		(scores) => scores.reduce((p, c) => p + c, 0)
	);
</script>

<div class="w-full overflow-hidden">
	{#each cellsGroup.cells as cell, index}
		<BaseCell {cell} {index} />
	{/each}
</div>
{#key $subtotal}
	<div
		class="flex h-[38px] justify-end px-[16px] py-[1px] text-[13px] font-semibold text-white/[44%]"
		in:fly={{ y: 10 }}
	>
		{#if $subtotal > 0}
			{$subtotal}
		{/if}
	</div>
{/key}
<!-- 
<div>
	<div class="mb-2 grid grid-cols-[auto_1fr] items-center justify-between gap-[6px] text-sm">
		{#key $subtotal}
			<div class=" rounded bg-black/20 px-2 py-[1px]" in:fly={{ y: 10 }}>{$subtotal}</div>
		{/key}
		<div class="truncate opacity-60">
			{cellsGroup.name}
		</div>
	</div>
	<div class="flex flex-col gap-2">
		{#each cellsGroup.cells as cell}
			<BaseCell {cell} />
		{/each}
	</div>
</div> -->
