<script lang="ts">
	import { slide } from 'svelte/transition';
	import { getAccordionOptions } from './context';
	import NextArrow from '../Icon/NextArrow.svelte';
	import { cn } from '$lib/utils/cn';

	export let accordionItemStyles = '';
	export let carretStyles = '';
	export let titleStyles = '';
	export let contentStyles = '';
	export let buttonStyles = '';
	export let open = false;

	const componentId = crypto.randomUUID();
	const { colapse, activeComponentId } = getAccordionOptions();

	const setActive = () => ($activeComponentId = componentId);
	const toggleOpen = () => (open = !open);
	const handleClick = () => (colapse ? setActive() : toggleOpen());

	$: open && colapse && setActive();
	$: isActive = $activeComponentId === componentId;
	$: isOpen = colapse ? isActive : open;
</script>

<div class={cn('p-1', accordionItemStyles)}>
	<button
		on:click={handleClick}
		class={cn('flex w-full items-center justify-between', buttonStyles)}
	>
		<div class={cn('font-semibold text-black/80', titleStyles)}>
			<slot name="title" />
		</div>
		<div
			class={cn(
				'transition-transform duration-300',
				carretStyles,
				isOpen ? 'rotate-90' : 'rotate-0'
			)}
		>
			<NextArrow width={15} />
		</div>
	</button>

	{#if isOpen}
		<div transition:slide|local class={cn('mb-1 text-black/50', contentStyles)}>
			<slot name="content" />
		</div>
	{/if}
</div>
