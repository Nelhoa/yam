<script lang="ts">
	import { fade } from 'svelte/transition';
	import type { Game } from '$lib/models/yam';
	import GridPanel from './GridPanel.svelte';
	import PlayerList from './PlayerList.svelte';
	import { flip } from 'svelte/animate';
	import _ from 'lodash';
	import { createEventDispatcher } from 'svelte';
	import GridBase from './GridBase.svelte';
	const dispatch = createEventDispatcher();

	export let game: Game;
	$: grids = game.grids;
	$: sortedGrids = _.orderBy($grids, (grid) => grid.player.name);

	function restart() {
		dispatch('restart');
	}
</script>

<div class="m-auto grid h-full w-full bg-[#0E7133] py-[3vh]" in:fade>
	<div class="grid h-full min-h-0 grid-rows-[1fr_auto] gap-4">
		<div class="grid h-full min-h-0 grid-flow-col justify-center overflow-y-scroll">
			{#if sortedGrids[0]}
				<div class="h-full w-[110px]">
					<GridBase grid={sortedGrids[0]} />
				</div>

				<div class="h-full shrink-0 justify-center gap-0 overflow-x-auto">
					{#each sortedGrids as grid (grid)}
						<div class="h-full min-h-0 w-[180px] shrink-0" animate:flip>
							<GridPanel {grid} />
						</div>
					{/each}
				</div>
			{/if}
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
</div>
