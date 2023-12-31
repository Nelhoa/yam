<script lang="ts">
	import Modal from '$lib/components/Layout/Modal/Modal.svelte';
	import type { ModalElement } from '$lib/components/Layout/Modal/util-modal';
	import { cn } from '$lib/utils/cn';
	import { fly } from 'svelte/transition';
	import type { Game } from '$lib/models/yam';
	import _ from 'lodash';
	import Cross from '$lib/components/Icon/Cross.svelte';
	import { CellEditable, type AnyCell, DerivedCell } from '$lib/models/Cells';

	export let cell: AnyCell;
	let ModalRemote: ModalElement;
	$: score = cell.score;
	$: isEditable = cell instanceof CellEditable;
	$: isDone = cell instanceof CellEditable ? cell.isDone : undefined;
	$: notEditableDone = cell instanceof DerivedCell && $score > 0;
	$: isModalOpen = ModalRemote?.isVisible;

	function setScore(value: number) {
		ModalRemote?.close();
		if (!(cell instanceof CellEditable)) return;
		cell.setScore(value);
	}

	function resetScore() {
		ModalRemote?.close();
		if (!(cell instanceof CellEditable)) return;
		cell.resetScore();
	}
</script>

<Modal
	mode="flip"
	bind:Modal={ModalRemote}
	disabled={!isEditable}
	modalStyles="p-4 bg-black/50 backdrop-blur border border-red-700 min-h-0 max-h-[40vh] overflow-y-auto"
	backdropStyles="bg-black/20"
	buttonStyles={cn(
		'rounded border border-transparent flex px-3 h-[30px] bg-green-800/80 hover:bg-green-700 gap-2 justify-between items-center',
		isEditable && !$isDone && 'border-green-400 bg-green-700/70',
		$isModalOpen && 'bg-green-700 border-green-600',
		!isEditable && 'bg-black/10 hover:bg-black/10'
	)}
>
	<svelte:fragment slot="button">
		<div class={cn('text-sm', isEditable && $isDone && 'opacity-50')}>{cell.name}</div>
		{#key $score}
			<div class="font-semibold" in:fly={{ y: 10 }}>
				{#if isEditable ? $isDone && $score > 0 : $score > 0}{$score}{:else if $isDone}
					<div class="opacity-50">
						<Cross width={11} />
					</div>
				{/if}
			</div>
		{/key}
	</svelte:fragment>
	<svelte:fragment slot="menu">
		{#if cell instanceof CellEditable}
			<div class="grid grid-cols-4 gap-[10px] overflow-y-auto">
				{#if $isDone}
					<button
						on:click={() => resetScore()}
						class="col-span-full flex h-[34px] items-center justify-center rounded bg-white/20 font-semibold text-white"
						>Reset</button
					>
				{/if}
				<button
					on:click={() => setScore(0)}
					class="col-span-full flex h-[34px] items-center justify-center rounded bg-red-600 font-semibold text-white"
					>Barrer</button
				>
				{#each cell.autorisedValues as value}
					<button
						on:click={() => setScore(value)}
						class="flex h-[34px] w-[34px] items-center justify-center rounded bg-red-600 font-semibold text-white"
						>{value}</button
					>
				{/each}
			</div>
		{/if}
	</svelte:fragment>
</Modal>
