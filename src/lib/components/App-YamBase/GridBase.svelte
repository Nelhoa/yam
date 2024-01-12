<script lang="ts">
	import type { Grid } from '$lib/models/yam';

	export let grid: Grid;
</script>

<div class="h-[75px]"></div>
<div>
	{#each grid.cellsGroups as group}
		<div class="w-full overflow-hidden rounded-[12px_0px_0px_12px]">
			{#each group.cells as cell, index}
				<div
					style={`background-color: ${
						index % 2 === 1 ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.06)'
					};`}
					class="flex h-[38px] w-full items-center truncate border-b-[1.5px] border-r-[1.5px] border-b-black/[.15] border-r-black/[.15] px-3 text-[15px] font-medium"
				>
					{cell.name}
				</div>
			{/each}
		</div>
		<div class="h-[38px]"></div>
	{/each}
</div>
