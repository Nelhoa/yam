<script lang="ts">
	import CenteredModal from '$lib/components/Layout/Modal/CenteredModal.svelte';
	import type { ModalElement } from '$lib/components/Layout/Modal/util-modal';
	import Bin from '$lib/components/Icon/Bin.svelte';
	import { deleteGame, games } from '$lib/models/store-games';
	import type { Game } from '$lib/models/yam';
	import { createEventDispatcher } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import { get } from 'svelte/store';
	import { fly, slide } from 'svelte/transition';
	import _ from 'lodash';
	import { players } from '$lib/models/store-players';
	import PlayerRecord from './PlayerRecord.svelte';
	const dispatch = createEventDispatcher();

	let MenuModal: ModalElement;
	export let buttonStyles = '';

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
					<div class="mb-2">Meilleurs scores en Foufou Mode !</div>
					<div class="px-3">
						<div class="grid grid-cols-[1fr_55px_55px_55px_55px] gap-x-1 text-white/50">
							<div class="text-left">Joueur</div>
							<div class="text-center">Max</div>
							<di class="text-center">Min</di>
							<div class="text-center">Moy.</div>
							<di class="text-center">Nb.</di>
						</div>
						{#each $players as player}
							<PlayerRecord {player} />
						{/each}
					</div>
				</div></svelte:fragment
			>
		</CenteredModal>
	</div>
{/if}
