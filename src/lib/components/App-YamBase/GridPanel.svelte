<script lang="ts">
	import CellsGroup from './CellsGroup.svelte';
	import type { Grid } from '$lib/models/yam';

	export let grid: Grid;
	$: player = grid.player;
	$: cellsGroups = grid.cellsGroups;
</script>

<div>
	<div class="">
		{#each cellsGroups as cellsGroup}
			<CellsGroup {cellsGroup} {grid} />
		{/each}
	</div>
	<!-- <div class="p-4 pb-5">
		<ConfirmationModal
			buttonStyles="mt-1 rounded bg-black/5 px-2 py-[2px] text-sm hover:bg-black/10"
			message={`Êtes vous sûr de vouloir supprimer la grille de ${player.name} ?`}
			yesTitle="Supprimer"
			noTitle="Annuler"
			func={() => grid.remove()}
		>
			Supprimer
		</ConfirmationModal>
	</div> -->
</div>
