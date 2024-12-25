<script lang="ts">
	import type { buildersKey } from '$lib/models/Builders';
	import { Player } from '$lib/models/Player';
	import { get } from 'svelte/store';

	export let player: Player;
	export let ruleKey: buildersKey = 'foufouGrid';
	$: grids = player.grids;
	$: selectedRuleGrids = $grids.filter(
		(i) => i.game.builderName === ruleKey && get(i.percentFinished) === 1
	);
	$: scores = selectedRuleGrids.map((i) => get(i.score));
	$: best = Math.max(...scores);
	$: worst = Math.min(...scores);
	$: total = scores.reduce((cur, prev) => prev + cur, 0);
	$: average = total / scores.length;
</script>

{#if selectedRuleGrids.length > 0}
	<div class="py-1">
		<div class="grid grid-cols-[1fr_55px_55px_55px_55px] gap-x-1">
			<div class="text-left">{player.name}</div>
			<div class="text-center">{best}</div>
			<div class="text-center">{worst}</div>
			<div class="text-center">{average}</div>
			<div class="text-center">{scores.length}</div>
		</div>
	</div>
{/if}
