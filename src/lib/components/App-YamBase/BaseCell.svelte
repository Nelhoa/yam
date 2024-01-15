<script lang="ts">
	import Modal from '$lib/components/Layout/Modal/Modal.svelte';
	import type { ModalElement } from '$lib/components/Layout/Modal/util-modal';
	import { cn } from '$lib/utils/cn';
	import { fly } from 'svelte/transition';
	import _ from 'lodash';
	import Cross from '$lib/components/Icon/Cross.svelte';
	import { CellEditable, type AnyCell } from '$lib/models/Cells';
	import { cellClicked } from '$lib/models/store-cell-clicked';
	import { col } from './colors';

	export let cell: AnyCell;
	export let index: number;
	let ModalRemote: ModalElement;
	$: score = cell.score;
	$: isEditable = cell instanceof CellEditable;
	$: isDone = cell instanceof CellEditable ? cell.isDone : undefined;
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

	$: if ($isModalOpen) cellClicked.set(cell as CellEditable);
	$: if (!$isModalOpen) cellClicked.set(undefined);
	$: rowClicked = $cellClicked?.name === cell.name;
	$: playerClicked = $cellClicked?.grid === cell.grid;
	$: isClicked = $cellClicked === cell;
	$: highlight = rowClicked || playerClicked;
	$: theme = col[index % 2]!;
	$: color = isClicked ? theme.selected : highlight ? theme.highlighted : theme.normal;
</script>

<Modal
	mode="flip"
	bind:Modal={ModalRemote}
	disabled={!isEditable}
	modalStyles="p-4 z-50 bg-black/50 backdrop-blur border border-red-700 min-h-0 max-h-[40vh] overflow-y-auto"
	backdropStyles="bg-black/10 backdrop-blur-[2px] z-10"
	buttonCSS={`background-color: ${color}; z-index: ${highlight ? 20 : 0}; position: ${
		highlight ? 'relative' : 'static'
	};`}
	buttonStyles={cn(
		'group transition-colors flex h-[38px] w-full justify-center  items-center truncate border-b-[1.5px] border-r-[1.5px] border-b-black/[.15] border-r-black/[.15] px-3 font-bold',
		isClicked && 'border  bg-white rounded'
	)}
>
	<svelte:fragment slot="button">
		{#key $score}
			<div class="font-semibold" in:fly={{ y: 10 }}>
				{#if isEditable ? $isDone && $score > 0 : $score > 0}
					<div
						class={cn('text-[18px]', !isEditable && 'text-green-400')}
						style="text-shadow: 1px 1px 2px rgba(0,0,0,70%);"
					>
						{$score}
					</div>
				{:else if isEditable && !$isDone}
					<div
						style="box-shadow: 1px 1px 4px rgba(0,0,0,80%);"
						class={cn(
							'h-[20px] w-[20px] rounded-full border border-[#4ADE80] bg-[#13863E] transition-opacity transition-transform group-hover:scale-125 group-hover:border-[#afffcd] group-hover:bg-[#29bb5f]',
							$cellClicked && 'opacity-0',
							isClicked && 'opacity-0'
						)}
					></div>
				{:else if $isDone}
					<div class="opacity-30">
						<Cross width={14} />
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
