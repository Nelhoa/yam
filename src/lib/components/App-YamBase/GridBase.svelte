<script lang="ts">
	import type { Grid } from '$lib/models/yam';
	import RowTitleCell from './RowTitleCell.svelte';

	export let grid: Grid;
</script>

<div>
	{#each grid.cellsGroups as group}
		<div class="w-full overflow-hidden rounded-[12px_0px_0px_12px]">
			{#each group.cells as cell, index}
				<RowTitleCell {cell} {index} />
			{/each}
		</div>
		<div class="h-[38px]"></div>
	{/each}
</div>
