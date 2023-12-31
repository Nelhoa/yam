<script lang="ts">
	import type dayjs from 'dayjs';
	import Modal from '../Layout/Modal/Modal.svelte';
	import { fly } from 'svelte/transition';
	import { cn } from '$lib/utils/cn';
	import { getNextTabElement } from '$lib/utils/Public/Helpers/getNextTabElement';
	import { wait } from '$lib/utils/Public/wait';
	import DatePickerMenu from './DatePickerMenu.svelte';
	import type { ModalElement } from '../Layout/Modal/util-modal';

	export let date: dayjs.Dayjs | undefined = undefined;
	export let title = 'Entrez une date';
	export let buttonStyles = '';
	export let minDate: dayjs.Dayjs | undefined = undefined;
	export let maxDate: dayjs.Dayjs | undefined = undefined;
	export let selectNextElement = true;
	export let ButtonElement: HTMLElement | undefined = undefined;
	export let insideButtonStyles = '';
	let DatePickerModal: ModalElement;
	$: modalAnchor = DatePickerModal?.anchor;
	$: ButtonElement = $modalAnchor;
	$: isVisible = DatePickerModal?.isVisible;

	function handleDateSelect() {
		DatePickerModal?.close();
		if (selectNextElement) gotoNextElement();
	}

	async function gotoNextElement() {
		if (!ButtonElement) return;
		await wait(15);
		const nextElement = getNextTabElement(ButtonElement);
		if (nextElement) nextElement.focus();
	}
</script>

<Modal
	bind:Modal={DatePickerModal}
	openOnFocus
	mode="flip"
	modalStyles="p-2 border border-blueBank"
	buttonStyles={cn(
		'px-3 border border-black/10 hover:border-black/20 hover:bg-blueBank/5 hover:text-black/60 text-black/50 rounded',
		$isVisible &&
			'border-blueBank shadow hover:border-blueBank hover:text-black hover:bg-white hover:text-black/50',
		date && 'text-black hover:text-black',
		date && $isVisible && 'hover:text-black',
		buttonStyles
	)}
>
	<svelte:fragment slot="button">
		{#key date}
			<div in:fly={{ y: 3 }} class={cn(insideButtonStyles)}>
				{date?.format('Do MMM YYYY') ?? title}
			</div>
		{/key}
	</svelte:fragment>
	<svelte:fragment slot="menu">
		<DatePickerMenu bind:date on:select={handleDateSelect} {minDate} {maxDate} />
	</svelte:fragment>
</Modal>
