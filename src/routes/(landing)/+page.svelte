<script lang="ts">
	import { onMount } from 'svelte';
	import Game from '$lib/components/App-YamBase/Game.svelte';
	import type { Game as GameClass } from '$lib/models/yam';
	import { loadYamStores } from '$lib/models/store-load';
	import { newGame } from '$lib/models/store-games';
	import GamesList from '$lib/components/App-YamBase/GamesList.svelte';
	import { buildersArray, type buildersKey } from '$lib/models/Builders';
	import GridMode from '$lib/components/App-YamBase/GridMode.svelte';
	import PlayerScores from '$lib/components/App-YamBase/PlayerScores.svelte';

	let game: GameClass | undefined = undefined;
	$: gridMode = game?.gridMode;

	function launchGame(key: buildersKey) {
		game = newGame(key);
	}

	function selectGame(event: CustomEvent) {
		game = event.detail;
	}

	onMount(() => loadYamStores());
</script>

{#if game}
	<div class="h-screen bg-red-800 text-white">
		{#if $gridMode}
			<GridMode {game} on:restart={() => (game = undefined)} />
		{:else}
			<Game {game} on:restart={() => (game = undefined)} />
		{/if}
	</div>
{:else}
	<div class="flex h-screen items-center justify-center bg-red-800">
		<div
			class="flex h-[70%] w-[90%] max-w-[400px] flex-col items-center justify-center rounded border-red-500 p-5 text-white"
		>
			<img
				src="https://cdn-icons-png.flaticon.com/512/8027/8027947.png"
				alt="Logo du yam"
				class="mb-2 w-[120px] animate-bounce drop-shadow"
			/>
			<div class="font-poppins text-3xl font-bold">Cosquer’Yams !</div>
			<div class="mt-5 flex shrink-0 flex-col items-center justify-center gap-4">
				{#each buildersArray.filter(([key, rule]) => rule.deprecated != true) as [key, builder]}
					<button
						class="shrink-0 rounded border-2 border-red-500 bg-red-600 px-3 py-1 text-2xl font-bold transition-all duration-75 hover:scale-125"
						on:click={() => launchGame(key)}
					>
						{builder.title}</button
					>
				{/each}
			</div>

			<div class="mt-5 flex justify-center gap-3">
				<GamesList buttonStyles="" on:select={selectGame} />
				<PlayerScores buttonStyles="" />
			</div>
			<div class="mt-5 text-sm text-white/50">© Neil Savin 2024</div>
		</div>
	</div>
{/if}
