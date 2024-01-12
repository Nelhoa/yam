<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import type { Unsubscriber } from 'svelte/store';
	import Modal from '../Layout/Modal/Modal.svelte';
	import { ciu } from './custom-input-utility';
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import type { ModalElement } from '../Layout/Modal/util-modal';
	import { wait } from '$lib/utils/Public/wait';
	import { getNextTabElement } from '$lib/utils/Public/Helpers/getNextTabElement';
	const dispatch = createEventDispatcher();

	export let id: string = '';
	export let selectNextElement = true;
	export const InputElement = new ciu.CustomInputClass(id);
	export let baseValue: ciu.ValueOrWritable;
	export let type: 'text' | 'number';
	export let displayFunction: ciu.DisplayCallback = (item) => item;
	export let styles = '';
	export let buttonStyles = '';
	export let inputStyles = '';
	export let toolTipStyles = '';
	export let showTooltip = false;
	export let placeHolder = '';
	export let placeHolderStyles = '';
	export let selectOnFocus = false;
	export let emptyStyles = '';
	export let focus = false;
	let ButtonToolTip: ModalElement;
	$: ButtonElement = ButtonToolTip?.anchor;
	$: isEditing = InputElement.isEditing;

	let unsubscribe: Unsubscriber | undefined;
	let value = ciu.getCurrent(baseValue);
	$: if (!$isEditing) value = ciu.getCurrent(baseValue);
	let oldValue: ciu.Value;
	const baseStyles = 'focus:outline-none focus:shadow px-2 py-[1px] rounded';

	if (baseValue && typeof baseValue === 'object' && 'subscribe' in baseValue) setSubscriber();

	function setSubscriber() {
		if ($isEditing) return;
		if (unsubscribe) unsubscribe();
		if (baseValue && typeof baseValue === 'object' && 'subscribe' in baseValue)
			unsubscribe = baseValue.subscribe((sub) => (value = sub));
	}

	function onInputMount(element: HTMLInputElement) {
		element.focus();
		if (selectOnFocus) element.select();
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			closeEditing();
			gotoNextElement();
		}
	}

	function openEditing() {
		oldValue = ciu.getCurrent(baseValue);
		$isEditing = true;
	}

	async function gotoNextElement() {
		await wait(15);
		if (!$ButtonElement || !selectNextElement) return;
		const nextElement = getNextTabElement($ButtonElement);
		if (nextElement) nextElement.focus();
	}

	function closeEditing() {
		if (!$isEditing) return;
		if (value === null) value = undefined;
		if (typeof baseValue === 'string' || typeof baseValue === 'number' || !baseValue) {
			baseValue = value;
		} else baseValue.set(value);
		$isEditing = false;
		dispatchUpdate();
	}

	function dispatchUpdate() {
		if (value === oldValue) return;
		const updatedValues: ciu.UpdatedValues<ciu.Value> = {
			oldValue,
			newValue: ciu.getCurrent(baseValue)
		};
		dispatch('update', { updatedValues });
	}

	function handleButtonFocus() {
		openEditing();
		// const button = ButtonToolTip?.getAnchor();
		// button?.click();
	}

	onMount(async () => {
		await wait(15);
		if (focus) InputElement.isEditing.set(true);
	});

	onDestroy(() => {
		if (unsubscribe) unsubscribe();
	});
</script>

{#if !$isEditing}
	<Modal
		bind:Modal={ButtonToolTip}
		{toolTipStyles}
		{showTooltip}
		clickFunction={openEditing}
		on:buttonFocusIn={handleButtonFocus}
		buttonStyles={cn(
			'truncate',
			baseStyles,
			styles,
			buttonStyles,
			!value && placeHolderStyles,
			!value && emptyStyles
		)}
	>
		<svelte:fragment slot="button">{value ? displayFunction(value) : placeHolder}</svelte:fragment>
		<svelte:fragment slot="tooltip">{value ? displayFunction(value) : placeHolder}</svelte:fragment>
	</Modal>
{:else if type === 'text'}
	<input
		on:blur={closeEditing}
		bind:value
		type="text"
		class={cn(baseStyles, styles, inputStyles)}
		on:keydown={handleKeydown}
		use:onInputMount
	/>
{:else if type === 'number'}
	<input
		on:blur={closeEditing}
		bind:value
		type="number"
		class={cn(baseStyles, styles, inputStyles)}
		on:keydown={handleKeydown}
		use:onInputMount
	/>
{/if}
