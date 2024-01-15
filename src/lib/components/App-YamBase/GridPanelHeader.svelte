<script lang="ts">
	import { cellClicked } from '$lib/models/store-cell-clicked';
	import type { Grid } from '$lib/models/yam';
	import { cn } from '$lib/utils/cn';
	import { fly } from 'svelte/transition';
	export let grid: Grid;
	$: score = grid.score;
	$: player = grid.player;
</script>

<div
	class={cn(
		'flex h-full flex-col items-center justify-center gap-[4px]',
		$cellClicked?.grid === grid && 'relative z-[20]'
	)}
>
	{#key $score}
		<div
			class="rounded bg-black/[15%] px-2 py-1 font-poppins text-[19px] font-semibold leading-none"
			in:fly={{ y: 10 }}
		>
			{$score}
		</div>
	{/key}
	<div
		class="truncate font-poppins text-[15px] font-medium tracking-tight"
		style="text-shadow: 1px 1px 2px rgba(0,0,0,50%);"
	>
		{player.name}
	</div>
</div>
