<script lang="ts">
	import type { Scenario } from '$lib/models/scenario/scenario';
	import Modal from '../Layout/Modal/Modal.svelte';
	import type { ModalElement } from '../Layout/Modal/util-modal';
	import { colors } from './scenario-colors';

	export let parentScenario: Scenario;
	export let isVisible: boolean;
	export let selectedColor: string;
	let newScenarioName = '';
	let ColorModal: ModalElement;
	let nameInputElement: HTMLInputElement;

	async function submit() {
		parentScenario.newChild(newScenarioName, selectedColor);
		isVisible = false;
	}

	function handleColorSelect(color: string) {
		ColorModal?.close();
		selectedColor = color;
		nameInputElement.focus();
	}

	function handleInputKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter') submit();
		if (event.key === 'Escape') {
			event.stopPropagation();
			isVisible = false;
		}
	}

	function handleFocusIn() {
		ColorModal?.close();
	}

	$: if (nameInputElement) nameInputElement.focus();
</script>

<div class="ml-4 grid grid-cols-[auto_1fr] items-center gap-x-3 rounded px-2 py-[4px]">
	<div class="flex h-full items-center">
		<Modal bind:Modal={ColorModal}>
			<button
				class={`h-[12px] w-[12px] rounded shadow hover:scale-110`}
				style={`background-color: ${selectedColor};`}
				on:click|preventDefault
				slot="button"
			/>
			<div slot="menu" class="grid grid-cols-5 gap-[6px] p-3">
				{#each colors as color (color.hex)}
					<button
						on:click={() => handleColorSelect(color.hex)}
						class={`h-[22px] w-[22px] rounded-full hover:scale-110`}
						style={`background-color: ${color.hex};`}
						title={color.title}
					/>
				{/each}
			</div>
		</Modal>
	</div>

	<!-- svelte-ignore a11y-autofocus -->
	<input
		bind:this={nameInputElement}
		type="text"
		placeholder="Nom du scenario"
		class="rounded px-[7px] py-[3px] focus:shadow focus:outline-none"
		bind:value={newScenarioName}
		on:keydown={handleInputKeyDown}
		on:focusin={handleFocusIn}
	/>
</div>
