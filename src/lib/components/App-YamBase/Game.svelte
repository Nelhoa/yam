<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import PlayerScore from './PlayerScore.svelte';
	import type { Game } from '$lib/models/yam';
	import GridPanel from './GridPanel.svelte';
	import { fade, fly } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import _ from 'lodash';
	import PlayerList from './PlayerList.svelte';
	const dispatch = createEventDispatcher();

	export let game: Game;

	const grids = game.grids;
	$: selectedGrid = game.selectedGrid;

	function restart() {
		dispatch('restart');
	}
</script>

<div
	class="m-auto grid h-full w-[90%] max-w-[450px] grid-cols-[2fr_3fr] grid-rows-[1fr_auto] gap-4 py-[3vh]"
	in:fade
>
	<div class="grid h-full min-h-0 grid-rows-[auto_1fr_auto] gap-5">
		<div>
			<button on:click={restart}>
				<img
					src="https://cdn-icons-png.flaticon.com/512/8027/8027947.png"
					alt="Logo du yam"
					class="w-[50px] drop-shadow transition-all duration-100 hover:scale-125"
				/>
			</button>
			<h1 class="max-w-[100px] font-poppins text-2xl font-bold leading-tight text-balance">
				{game.builderTitle}
			</h1>
		</div>

		<div class="grid content-start gap-[10px] overflow-y-auto pr-1">
			{#each $grids as grid (grid)}
				<div animate:flip>
					<PlayerScore {grid} />
				</div>
			{/each}
		</div>
		<div class="mt-auto">
			<button
				class="mb-4 rounded bg-black/20 px-3 py-[1px]"
				on:click={() => game.gridMode.set(true)}>Vue grilles</button
			>
			<PlayerList {game} />
		</div>
	</div>
	{#key $selectedGrid}
		<div class="h-full min-h-0" in:fly={{ x: 20 }}>
			{#if $selectedGrid}
				<GridPanel grid={$selectedGrid} />
			{/if}
		</div>
	{/key}
</div>
