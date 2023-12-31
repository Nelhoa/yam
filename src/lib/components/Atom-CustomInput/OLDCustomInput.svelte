<script context="module" lang="ts">
	let id = 0;
	let customInputs = new Set<{ id: number; open: () => void; branch: string }>();
</script>

<script lang="ts">
	import { twMerge } from 'tailwind-merge';
	import type { updateFunction } from '$lib/types/customTypes';

	import { displayNumber } from '$lib/utils/Public/Helpers/displayHelpers';
	import { onMount } from 'svelte';
	id++;
	const componentId = id;

	export let inputType: 'number' | 'text';
	export let inputValue: string | number | null;
	export let branchName: string;
	export let update: updateFunction<any>;
	export let isRowOpened = false;
	export let className = '';
	export let alertEmpty = false;
	export let disabled = false;

	let modifiedValue = inputValue;
	let inputFocused = false;
	let loading = false;
	let escaped = false;

	function open() {
		escaped = false;
		isRowOpened = true;
		inputFocused = true;
	}

	function escape() {
		escaped = true;
	}

	function inputKeydown(event: KeyboardEvent) {
		event.stopImmediatePropagation();
		if (event.key === 'Escape') leaveAndDiscardChange();
		if (event.key === 'Enter') {
			leaveAndSaveChange();
			event.preventDefault();
		}
		if (event.key === 'Tab' && !event.shiftKey) {
			leaveAndSaveChange();
			goToInput(1, branchName);
			event.preventDefault();
		}
		if (event.key === 'Tab' && event.shiftKey) {
			leaveAndSaveChange();
			goToInput(-1, branchName);
			event.preventDefault();
		}
	}

	function goToInput(offset: number, branch?: string) {
		const inputList = [...customInputs.values()];
		if (branch)
			inputList
				.find((input) => input.id === componentId + offset && input.branch === branch)
				?.open();
		if (!branch) inputList.find((input) => input.id === componentId + offset)?.open();
	}

	async function leaveAndSaveChange() {
		escape();
		if (modifiedValue === inputValue) {
			close();
			return null;
		}
		loading = true;
		const originalValue = inputValue;
		inputValue = modifiedValue;
		close();
		let { success, value: updatedValue } = await update(modifiedValue);
		if (
			updatedValue === null ||
			typeof updatedValue === 'string' ||
			typeof updatedValue === 'number'
		)
			if (success) inputValue = updatedValue;
		if (!success) inputValue = originalValue;
		loading = false;
	}

	function inputFocusOut() {
		if (escaped) return null;
		leaveAndSaveChange();
	}

	function leaveAndDiscardChange() {
		escape();
		modifiedValue = inputValue;
		close();
	}

	function close() {
		isRowOpened = false;
		inputFocused = false;
	}

	onMount(() => {
		const element = { id: componentId, open: open, branch: branchName };
		customInputs.add(element);
		return () => customInputs.delete(element);
	});
</script>

<div class="grid h-full w-full" class:empty={!inputValue && alertEmpty}>
	{#if inputFocused}
		<!-- svelte-ignore a11y-autofocus -->
		{#if inputType === 'number'}
			<input
				type="number"
				class={twMerge(
					`decoration-none nospin h-full w-full resize-none rounded px-3 text-sm focus:outline-none`,
					className
				)}
				bind:value={modifiedValue}
				spellcheck="false"
				autofocus
				min="0"
				onfocus="this.select();"
				on:keydown|stopPropagation={inputKeydown}
				on:focusout={inputFocusOut}
			/>
		{:else}
			<textarea
				class={twMerge(
					`h-full w-full resize-none rounded px-3 pt-[3px] focus:outline-none `,
					className
				)}
				bind:value={modifiedValue}
				spellcheck="false"
				wrap="hard"
				rows="1"
				autofocus
				onfocus="this.select();"
				on:keydown|stopPropagation={inputKeydown}
				on:focusout={inputFocusOut}
			/>
		{/if}
	{:else}
		<button
			on:click={open}
			class={twMerge(
				`h-full w-full truncate border border-transparent px-3 hover:bg-black/[.03]`,
				className
			)}
			disabled={loading || disabled}
		>
			{typeof inputValue === 'number'
				? displayNumber(inputValue)
				: inputValue === null
				? ''
				: inputValue}
		</button>
	{/if}
</div>

<style lang="postcss">
	.empty {
		@apply border-b-2 border-yellow-400/50;
	}
</style>
