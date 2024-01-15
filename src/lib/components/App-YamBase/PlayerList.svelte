<script lang="ts">
	import { deletePlayer, newPlayer, players } from '$lib/models/store-players';
	import CenteredModal from '$lib/components/Layout/Modal/CenteredModal.svelte';
	import type { ModalElement } from '$lib/components/Layout/Modal/util-modal';
	import type { Game } from '$lib/models/yam';
	import { wait } from '$lib/utils/Public/wait';
	import Bin from '$lib/components/Icon/Bin.svelte';
	import type { Player } from '$lib/models/Player';
	import ConfirmationModal from '$lib/components/Layout/ConfirmationModal.svelte';

	export let game: Game;
	let addPlayerMode = false;
	let MenuModal: ModalElement;
	$: grids = game.grids;
	$: playersInGame = $grids.map((i) => i.player);
	$: filteredPlayers = $players.filter((i) => !playersInGame.includes(i));
	$: modalOpened = MenuModal?.isVisible;
	$: if (!$modalOpened) addPlayerMode = false;

	function onInputMount(element: HTMLElement) {
		async function focus() {
			await wait(20);
			element.focus();
		}

		focus();
	}

	let playerName = '';

	function addPlayer() {
		if (playerName.length < 2) return;
		newPlayer(playerName);
		addPlayerMode = false;
		playerName = '';
	}

	function addGrid(player: Player) {
		game.addGrid(player);
		// MenuModal?.close();
	}

	function remove(player: Player) {
		game.removePlayer(player);
	}
</script>

<CenteredModal
	bind:Modal={MenuModal}
	buttonStyles="px-5 py-1 text-sm  font-bold bg-white/10 hover:bg-white/20 font-poppins rounded"
	modalStyles="w-[90%] max-w-[300px] bg-black/50 backdrop-blur-lg text-white h-[70vh]"
	backdropStyles="bg-black/20 backdrop-blur-sm"
>
	<svelte:fragment slot="button">Joueurs</svelte:fragment>
	<svelte:fragment slot="menu">
		{#if !addPlayerMode}
			<div class="grid h-full min-h-0 grid-rows-[1fr_1fr_auto]">
				<div class="flex min-h-0 flex-col gap-2 overflow-y-auto p-5">
					<div>En jeu</div>
					{#each playersInGame as player}
						<div class="grid grid-cols-[1fr_auto] gap-2">
							<button
								class="truncate rounded bg-white/10 px-3 py-[5px] text-left font-semibold text-white hover:bg-white/20"
								on:click={() => addGrid(player)}
							>
								{player.name}
							</button>
							<button
								on:click={() => remove(player)}
								class="h-full rounded bg-white/5 px-2 text-white/30 hover:bg-white/10"
							>
								<Bin width={13} />
							</button>
						</div>
					{/each}
				</div>
				<div class="flex min-h-0 flex-col gap-2 overflow-y-auto p-5">
					<div>Vos joueurs</div>
					{#each filteredPlayers as player}
						<div class="grid grid-cols-[1fr_auto] gap-2">
							<button
								class="truncate rounded bg-white/10 px-3 py-[5px] text-left font-semibold text-white hover:bg-white/20"
								on:click={() => addGrid(player)}
							>
								{player.name}
							</button>
							<ConfirmationModal
								buttonStyles="h-full rounded bg-white/5 px-2 text-white/30 hover:bg-white/10"
								message={`Êtes vous sûr de vouloir supprimer le joueur ?`}
								yesTitle="Supprimer"
								noTitle="Annuler"
								func={() => deletePlayer(player)}
							>
								<Bin width={13} />
							</ConfirmationModal>
						</div>
					{/each}
				</div>
				<div class="flex gap-3 p-5">
					<button
						class="rounded bg-green-500/50 px-3 py-1 hover:bg-green-500/80"
						on:click={() => (addPlayerMode = true)}>Ajouter un joueur</button
					>
					<button
						class="rounded bg-black/40 px-3 py-1 hover:bg-black/80"
						on:click={() => MenuModal?.close()}>Retour</button
					>
				</div>
			</div>
		{:else}
			<div class="flex h-full flex-col items-center justify-center p-5">
				<form on:submit|preventDefault class="grid gap-2">
					<div class="text-lg font-semibold">Ajouter un joueur</div>
					<input
						minlength="3"
						maxlength="18"
						class="rounded border border-black/5 bg-white/10 px-3 py-1 focus:shadow focus:outline-none"
						type="text"
						bind:value={playerName}
						use:onInputMount
					/>
					<button
						class="rounded bg-blueBank/80 py-1 font-semibold text-white hover:bg-blueBank"
						on:click={addPlayer}>Ajouter</button
					>
				</form>
				<button
					class="mt-3 w-full rounded bg-black/5 py-1 hover:bg-black/10"
					on:click={() => (addPlayerMode = false)}>Retour</button
				>
			</div>
		{/if}
	</svelte:fragment>
</CenteredModal>
