<script lang="ts">
	import ConfirmationModal from '$lib/components/Layout/ConfirmationModal.svelte';
	import { fly } from 'svelte/transition';
	import CellsGroup from './CellsGroup.svelte';
	import type { Grid } from './Models/yam';

	export let grid: Grid;
	$: score = grid.score;
	$: player = grid.player;
	$: cellsGroups = grid.cellsGroups;
</script>

<div class="grid h-full max-h-full grid-rows-[auto_1fr_auto] rounded bg-green-900">
	<div class="grid grid-cols-[auto_1fr] items-center gap-2 p-5 text-lg font-bold">
		{#key $score}
			<div class="rounded bg-black/20 px-2 py-1" in:fly={{ y: 10 }}>
				{$score}
			</div>
		{/key}
		<div class="truncate">
			{player.name}
		</div>
	</div>
	<div class="overflow-y-scroll">
		<div class="flex flex-col gap-5 p-5 py-0">
			{#each cellsGroups as cellsGroup}
				<CellsGroup game={grid.game} {cellsGroup} />
			{/each}
		</div>
	</div>
	<div class="p-4 pb-5">
		<ConfirmationModal
			buttonStyles="mt-1 rounded bg-black/5 px-2 py-[2px] text-sm hover:bg-black/10"
			message={`Êtes vous sûr de vouloir supprimer la grille de ${player.name} ?`}
			yesTitle="Supprimer"
			noTitle="Annuler"
			func={() => grid.remove()}
		>
			Supprimer
		</ConfirmationModal>
	</div>
</div>
