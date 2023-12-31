<script lang="ts">
	import type { Category } from '$lib/models/categories/category';
	import { createEventDispatcher, onMount } from 'svelte';
	import Modal from '../Layout/Modal/Modal.svelte';
	import Bin from '../Icon/Bin.svelte';
	import type { ModalElement } from '../Layout/Modal/util-modal';
	const dispatch = createEventDispatcher();

	export let category: Category;
	export let DeleteWarningModal: ModalElement;
	let isVisible: boolean;
	let deleteButton: HTMLButtonElement | undefined;
	$: if (deleteButton) {
		deleteButton.focus();
	}

	function accept() {
		isVisible = false;
		dispatch('delete');
	}
</script>

<Modal bind:Modal={DeleteWarningModal}>
	<button slot="button" class="flex px-3 text-black/[.15] hover:text-black active:text-red-600"
		><Bin width={12} /></button
	>
	<div class="flex w-[90vw] max-w-[350px] flex-col gap-2 p-5" slot="menu">
		<div>
			Êtes vous sûr de vouloir supprimer la catégorie
			<span
				class="inline border-b-2 font-semibold"
				class:keyColor={category.type === 'key'}
				class:incomeColor={category.type === 'income'}
				class:outcomeColor={category.type === 'outcome'}
			>
				{category.name}
			</span>

			?
		</div>
		<div class="text-sm text-black/70">
			Tous ses estimés et formules seront <span class="font-semibold text-black">supprimés</span>. {#if category.type !== 'key'}Ses
				transactions et ses engagés seront transférés dans <span
					class="inline border-b-[1px] font-semibold"
					class:incomeColor={category.type === 'income'}
					class:outcomeColor={category.type === 'outcome'}
				>
					À catégoriser</span
				>{/if}
		</div>
		<div class="mt-3 flex justify-start gap-2">
			<!-- svelte-ignore a11y-autofocus -->
			<button
				bind:this={deleteButton}
				class="rounded-sm bg-red-500 px-2 py-[2px] font-semibold text-white outline-1 outline-black hover:outline focus:outline"
				on:click={accept}>Oui, supprimer</button
			>
			<button
				class="rounded-sm bg-black/5 px-2 py-[2px] font-semibold hover:outline hover:outline-1 hover:outline-black/30"
				on:click={() => (isVisible = false)}>Annuler</button
			>
		</div>
	</div>
</Modal>

<style lang="postcss">
	.incomeColor {
		@apply border-green-500;
	}
	.outcomeColor {
		@apply border-red-500;
	}
	.keyColor {
		@apply border-blueBank;
	}
</style>
