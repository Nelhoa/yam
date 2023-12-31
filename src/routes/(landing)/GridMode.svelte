<script lang="ts">
	import { fade } from 'svelte/transition';
	import type { Game } from './Models/yam';
	import GridPanel from './GridPanel.svelte';
	import PlayerList from './PlayerList.svelte';
	import { flip } from 'svelte/animate';
	import _ from 'lodash';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let game: Game;
	$: grids = game.grids;
	$: sortedGrids = _.orderBy($grids, (grid) => grid.player.name);

	function restart() {
		dispatch('restart');
	}
</script>

<div class="m-auto grid h-full w-full bg-green-700 py-[3vh]" in:fade>
	<div class="grid h-full min-h-0 grid-rows-[1fr_auto] gap-4">
		<div class="flex h-full min-h-0 shrink-0 justify-center gap-5 overflow-x-auto px-[5vw] py-2">
			{#each sortedGrids as grid (grid)}
				<div class="h-full min-h-0 w-[180px] shrink-0" animate:flip>
					<GridPanel {grid} />
				</div>
			{/each}
		</div>
		<div class="mt-auto flex items-center justify-center gap-3">
			<button on:click={restart}>
				<img
					src="https://cdn-icons-png.flaticon.com/512/8027/8027947.png"
					alt="Logo du yam"
					class="w-[50px] drop-shadow transition-all duration-100 hover:scale-125"
				/>
			</button>
			<PlayerList {game} />
			<button class="rounded bg-black/20 px-3 py-[1px]" on:click={() => game.gridMode.set(false)}
				>Vue solo</button
			>
		</div>
	</div>

	<!-- <div class="grid h-full min-h-0 grid-rows-[auto_1fr_auto] gap-5">
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
		
	</div>
	{#key $selectedGrid}
		<div class="h-full min-h-0" in:fly={{ x: 20 }}>
			{#if $selectedGrid}
				<GridPanel grid={$selectedGrid} />
			{/if}
		</div>
	{/key} -->
</div>
