<script lang="ts">
	import { onMount } from 'svelte';
	import Modal from './Modal/Modal.svelte';
	import type { ModalElement } from './Modal/util-modal';

	export let func: Function;
	export let message: string = 'Êtes vous sûr ?';
	export let yesTitle: string = 'Confirmer';
	export let noTitle: string = 'Annuler';
	export let buttonStyles = '';
	let ModalElement: ModalElement;
	let confirmationButton: HTMLButtonElement;
	$: if (confirmationButton) confirmationButton.focus();

	function handleYes() {
		ModalElement?.close();
		func();
	}

	function handleNo() {
		ModalElement?.close();
	}
</script>

<Modal bind:Modal={ModalElement}>
	<button class={buttonStyles} slot="button"><slot /></button>
	<div slot="menu" class="flex max-w-[300px] flex-col gap-3 p-3">
		<div class="text-sm text-black/80">
			{message}
		</div>
		<div class="flex justify-end gap-x-2 outline-1 focus:outline">
			<button class="rounded bg-black/5 px-2 py-[1px] hover:bg-black/10" on:click={handleNo}
				>{noTitle}</button
			>
			<button
				bind:this={confirmationButton}
				class="rounded bg-black/5 px-2 py-[1px] outline-1 hover:bg-black/10 focus:outline"
				on:click={handleYes}>{yesTitle}</button
			>
		</div>
	</div>
</Modal>
