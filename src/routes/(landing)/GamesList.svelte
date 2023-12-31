<script lang="ts">
	import CenteredModal from '$lib/components/Layout/Modal/CenteredModal.svelte';
	import type { ModalElement } from '$lib/components/Layout/Modal/util-modal';
	import Bin from '$lib/components/Icon/Bin.svelte';
	import { deleteGame, games } from './Models/store-games';
	import type { Game } from './Models/yam';
	import { createEventDispatcher } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import { get } from 'svelte/store';
	import { fly, slide } from 'svelte/transition';
	import ConfirmationModal from '$lib/components/Layout/ConfirmationModal.svelte';
	import _ from 'lodash';
	const dispatch = createEventDispatcher();

	let MenuModal: ModalElement;
	export let buttonStyles = '';

	function select(game: Game) {
		dispatch('select', game);
	}

	$: sortedGames = _.orderBy(
		$games.filter((i) => get(i.grids).length > 0),
		(game) => game.date,
		'desc'
	);
</script>

{#if sortedGames.length > 0}
	<div in:fly={{ y: 20 }}>
		<CenteredModal
			bind:Modal={MenuModal}
			buttonStyles={cn(
				'px-5 py-1 text-sm  font-bold bg-white/10 hover:bg-white/20 font-poppins rounded',
				buttonStyles
			)}
			modalStyles="w-[90%] max-w-[300px] bg-black/50 backdrop-blur-lg text-white h-[70vh]"
			backdropStyles="bg-black/30"
		>
			<svelte:fragment slot="button">Vos parties</svelte:fragment>
			<svelte:fragment slot="menu">
				<div class="grid h-full min-h-0 grid-rows-[1fr_auto]">
					<div class="flex min-h-0 flex-col gap-2 overflow-y-auto p-5">
						{#each sortedGames as game}
							<div class="grid grid-cols-[1fr_auto] gap-2" transition:slide>
								<button
									class="flex flex-col truncate rounded bg-green-500/60 px-3 py-[5px] text-left font-semibold text-white hover:bg-green-500/80"
									on:click={() => select(game)}
								>
									<div class="font-semibold">
										{game.builderTitle}
									</div>
									<div class="w-full truncate text-sm text-white/70">
										{get(game.grids)
											.map((g) => g.player.name)
											.join(', ')}
									</div>
									<div class="text-[13px] text-white/70 first-letter:uppercase">
										{game.date.format('dddd Do MMM HH:mm')}
									</div>
								</button>
								<ConfirmationModal
									buttonStyles="h-full rounded bg-white/5 px-2 text-white/30 hover:bg-white/10"
									message={`Êtes vous sûr de vouloir supprimer la partie de votre historique ?`}
									yesTitle="Supprimer"
									noTitle="Annuler"
									func={() => deleteGame(game)}
								>
									<Bin width={13} />
								</ConfirmationModal>
							</div>
						{/each}
					</div>
				</div>
			</svelte:fragment>
		</CenteredModal>
	</div>
{/if}
