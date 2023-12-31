<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { fly } from 'svelte/transition';
	import type { Grid } from './Models/yam';
	import { tweened } from 'svelte/motion';

	export let grid: Grid;
	const { player, score, percentFinished } = grid;
	const { selectedGrid } = grid.game;
	const tweenedPercentFinished = tweened<number>($percentFinished);
	$: tweenedPercentFinished.set($percentFinished);
	$: isSelected = $selectedGrid === grid;
</script>

<button
	on:click={() => grid.select()}
	class={cn(
		'text-semibold relative flex w-full flex-col rounded bg-black/10 px-2 py-[2px] pb-[8px] hover:bg-black/20',
		isSelected && 'bg-red-600 text-white hover:bg-red-600'
	)}
>
	<div class="truncate text-[15px] font-semibold">
		{player.name}
	</div>
	{#key $score}
		<div in:fly={{ y: 20 }} class="font-semibold">
			{$score} <span class="opacity-70">points</span>
		</div>
	{/key}
	<div
		class={cn(
			'absolute bottom-0 left-0 right-0 h-[5px] overflow-hidden rounded-[0_0_0.25rem_0.25rem] bg-black/40',
			!isSelected && 'opacity-30'
		)}
	>
		<div
			class={cn(`h-full`)}
			style={`width: ${Math.round($tweenedPercentFinished * 100)}%; background-color: hsl(-5deg ${
				$tweenedPercentFinished * 100
			}% 50%)`}
		></div>
	</div>
</button>
