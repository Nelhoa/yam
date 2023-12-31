<script lang="ts">
	import Portal from '$lib/components/Layout/Portal.svelte';
	import { cn } from '$lib/utils/cn';
	import { fly } from 'svelte/transition';
	import {
		computePosition,
		autoPlacement,
		shift,
		offset,
		autoUpdate,
		hide
	} from '@floating-ui/dom';
	import { tweened, type Tweened } from 'svelte/motion';
	import { wait } from '$lib/utils/Public/wait';
	import { mousePosition } from '$lib/stores/mouse-position-store';
	import { get } from 'svelte/store';
	import { ModalClass } from './util-modal';
	import { createEventDispatcher, onDestroy } from 'svelte';
	const dispatch = createEventDispatcher();
	let isClicking = false;

	export let mode: 'flip' | 'auto' = 'auto';
	export let toolTipAsModal = false;
	export let toolTipOnly = false;
	export let openOnMouse = false;

	export let modalStyles = '';
	export let buttonStyles = '';
	export let buttonCSS = '';
	export let backdropStyles = '';
	export let Modal = new ModalClass();
	export let clickFunction: Function | undefined = undefined;
	const { anchor, element, isVisible } = Modal;

	export let showTooltip = true;
	export let isToolTipVisible: boolean = false;
	export let toolTipStyles = '';
	export let openOnFocus = false;
	export let disabled = false;

	let xPosition: Tweened<number> | undefined;
	let yPosition: Tweened<number> | undefined;

	function setModalPosition(modal: HTMLDivElement) {
		const anchorElement = openOnMouse ? getMouseVirtualElement() : $anchor;
		if (!anchorElement) return;
		positionModal(anchorElement, modal);
		const cleanup = openOnMouse
			? () => undefined
			: autoUpdate(anchorElement, modal, () => positionModal(anchorElement, modal));
		const stop = () => {
			cleanup();
			openOnMouse = false;
			yPosition = undefined;
			xPosition = undefined;
		};
		return {
			destroy: stop
		};
	}

	function setToolTipPosition(tooltip: HTMLDivElement) {
		if (!$anchor) return;
		positionModal($anchor, tooltip);
		const cleanup = autoUpdate($anchor, tooltip, () => positionModal($anchor!, tooltip));

		const stop = () => {
			cleanup();
			yPosition = undefined;
			xPosition = undefined;
		};
		return {
			destroy: stop
		};
	}

	async function positionModal(anchor: HTMLElement, modalElement: HTMLDivElement) {
		const options: (typeof autoPlacement)['arguments'][0] =
			mode !== 'auto' ? { allowedPlacements: ['top', 'bottom'] } : {};
		computePosition(anchor, modalElement, {
			middleware: [offset(12), autoPlacement(options), shift({ padding: 24 }), hide()]
		}).then(({ x, y, middlewareData }) => {
			const hide = middlewareData.hide;
			if ($xPosition && $yPosition) {
				$xPosition = x;
				$yPosition = y;
			} else {
				xPosition = tweened(x, { duration: 0 });
				yPosition = tweened(y, { duration: 0 });
			}
			if (hide?.referenceHidden) Modal.close();
		});
	}

	function getMouseVirtualElement() {
		const { x: mouseX, y: mouseY } = get(mousePosition);
		return {
			getBoundingClientRect() {
				return {
					x: mouseX,
					y: mouseY,
					top: mouseY,
					left: mouseX,
					bottom: mouseY,
					right: mouseX,
					width: 0,
					height: 0
				};
			}
		} as HTMLElement;
	}

	function handleButtonFocusIn(event: Event) {
		dispatch('buttonFocusIn');
		if (isClicking) return;
		if (!openOnFocus) return;
		Modal.open();
	}

	function handleButtonPointerUp(event: MouseEvent) {
		if (disabled) return;
		clickFunction?.();
		if (event.button == 2) return;
		isClicking = false;
		Modal.switch();
	}

	function handleButtonPointerDown(event: PointerEvent) {
		if (event.button == 2) return;
		isClicking = true;
	}

	function handleWindowPointerDown() {
		isClicking = true;
		Modal.close();
	}

	function handleWindowPointerUp() {
		isClicking = false;
	}

	onDestroy(() => Modal.destroy());
</script>

<svelte:window on:pointerdown={handleWindowPointerDown} on:pointerup={handleWindowPointerUp} />

<!-- svelte-ignore a11y-click-events-have-key-events -->
{#if !toolTipOnly}
	<button
		{disabled}
		on:focusin={handleButtonFocusIn}
		style={buttonCSS}
		class={cn('focus:outline-none', buttonStyles)}
		bind:this={$anchor}
		on:click={handleButtonPointerUp}
		on:pointerdown={handleButtonPointerDown}
		on:mouseenter={() => (isToolTipVisible = true)}
		on:mouseleave={() => (isToolTipVisible = false)}
	>
		<slot name="button" />
	</button>
{:else}
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		style={buttonCSS}
		class={cn('focus:outline-none', buttonStyles)}
		bind:this={$anchor}
		on:mouseenter={() => (isToolTipVisible = true)}
		on:mouseleave={() => (isToolTipVisible = false)}
	>
		<slot name="button" />
	</div>
{/if}

{#if isToolTipVisible && !$isVisible && !toolTipAsModal && showTooltip}
	<Portal>
		<div
			use:setToolTipPosition
			transition:fly|local={{ y: 20, duration: 80 }}
			class={cn(
				'pointer-events-auto fixed top-0 z-10 w-max overflow-hidden rounded-lg bg-white text-black shadow-lg dark:bg-blueBank80 dark:text-white',
				toolTipStyles
			)}
			style="top: {$yPosition}px; left: {$xPosition}px;"
			on:pointerdown|stopPropagation
		>
			<!-- Content -->
			<slot name="tooltip" />
		</div>
	</Portal>
{/if}

{#if $isVisible || (isToolTipVisible && toolTipAsModal)}
	<Portal>
		<div
			bind:this={$element}
			id="modal"
			use:setModalPosition
			transition:fly|local={{ y: 20, duration: 80 }}
			class={cn(
				'pointer-events-auto fixed top-0 z-10 w-max overflow-hidden rounded-lg bg-white text-black shadow-lg dark:bg-blueBank80 dark:text-white',
				modalStyles
			)}
			style="top: {$yPosition}px; left: {$xPosition}px;"
			on:pointerdown|stopPropagation
		>
			<!-- Content -->
			<slot name="menu" />
		</div>
		<div class={cn('pointer-events-none fixed inset-0', backdropStyles)} />
	</Portal>
{/if}
