<script lang="ts">
	import Portal from '$lib/components/Layout/Portal.svelte';
	import { cn } from '$lib/utils/cn';
	import { fly } from 'svelte/transition';
	import { onDestroy } from 'svelte';
	import { ModalClass } from './util-modal';

	export let disabled = false;
	export let modalStyles = '';
	export let buttonStyles = '';
	export let buttonCSS = '';
	export let backdropStyles = '';
	export let Modal = new ModalClass();
	export let noButton = false;
	const { anchor, element, isVisible } = Modal;

	onDestroy(() => Modal.destroy());
</script>

<svelte:window on:pointerdown={() => Modal.close()} />

{#if !noButton}
	<button
		{disabled}
		style={buttonCSS}
		type="button"
		class={cn('', buttonStyles)}
		bind:this={$anchor}
		on:click|preventDefault={() => Modal.switch()}
	>
		<slot name="button" />
	</button>
{/if}

{#if $isVisible}
	<Portal>
		<div class="fixed inset-0 z-10 flex items-center justify-center">
			<div
				id="modal"
				bind:this={$element}
				on:scroll
				transition:fly|local={{ y: 50, duration: 80 }}
				class={cn(
					'pointer-events-auto overflow-hidden rounded-lg bg-white text-black shadow-lg dark:bg-blueBank80 dark:text-white',
					modalStyles
				)}
				on:pointerdown|stopPropagation
			>
				<!-- Content -->
				<slot name="menu" />
			</div>
		</div>
		<div class={cn('pointer-events-none fixed inset-0', backdropStyles)} />
	</Portal>
{/if}
