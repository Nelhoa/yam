<script lang="ts">
	import { derived } from 'svelte/store';
	import BaseCell from './BaseCell.svelte';
	import type { Game } from './Models/yam';
	import { fly } from 'svelte/transition';
	import type { CellsGroup } from './Models/Cells';

	export let cellsGroup: CellsGroup;
	export let game: Game;
	$: subtotal = derived(
		cellsGroup.cells.map((i) => i.score),
		(scores) => scores.reduce((p, c) => p + c, 0)
	);
</script>

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
			<BaseCell {cell} {game} />
		{/each}
	</div>
</div>
