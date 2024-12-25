<script lang="ts">
	import CenteredModal from '$lib/components/Layout/Modal/CenteredModal.svelte';
	import type { ModalElement } from '$lib/components/Layout/Modal/util-modal';
	import { games } from '$lib/models/store-games';
	import { cn } from '$lib/utils/cn';
	import { get } from 'svelte/store';
	import { fly } from 'svelte/transition';
	import _ from 'lodash';
	import { players } from '$lib/models/store-players';
	import PlayerRecord from './PlayerRecord.svelte';
	import type { buildersKey } from '$lib/models/Builders';

	let MenuModal: ModalElement;
	export let buttonStyles = '';
	let selectedMode: buildersKey = 'foufouGrid';
	const modes: Record<buildersKey, { title: string }> = {
		cosquericGrid: { title: 'Cosquéric' },
		foufouGrid: { title: 'Foufou' },
		parisGrid: { title: 'Paris' }
	};
	const modesKey = Object.keys(modes) as buildersKey[];

	$: sortedGames = _.orderBy(
		$games.filter((i) => get(i.grids).length > 0),
		(game) => game.date,
		'desc'
	);
</script>

{#if sortedGames.length > 0 && $players.length > 0}
	<div in:fly={{ y: 20 }}>
		<CenteredModal
			bind:Modal={MenuModal}
			buttonStyles={cn(
				'px-5 py-1 text-sm  font-bold bg-white/10 hover:bg-white/20 font-poppins rounded',
				buttonStyles
			)}
			modalStyles="w-[90%] max-w-[400px] bg-black/50 backdrop-blur-lg text-white h-[70vh]"
			backdropStyles="bg-black/30"
		>
			<svelte:fragment slot="button">Scores</svelte:fragment>
			<svelte:fragment slot="menu">
				<div class="grid h-full min-h-0 grid-rows-[auto_1fr] p-5">
					<div class="mb-2 flex gap-2">
						{#each modesKey as key}
							<button
								class={cn(
									'rounded border border-transparent bg-white/10 px-2 hover:bg-white/20',
									selectedMode === key && 'border-white'
								)}
								on:click={() => (selectedMode = key)}
							>
								{modes[key].title}
							</button>
						{/each}
					</div>
					<div class="px-3">
						<div class="grid grid-cols-[1fr_55px_55px_55px_55px] gap-x-1 text-white/50">
							<div class="text-left">Joueur</div>
							<div class="text-center">Max</div>
							<di class="text-center">Min</di>
							<div class="text-center">Moy.</div>
							<di class="text-center">Nb.</di>
						</div>
						{#each $players as player}
							<PlayerRecord {player} ruleKey={selectedMode} />
						{/each}
					</div>
				</div></svelte:fragment
			>
		</CenteredModal>
	</div>
{/if}
