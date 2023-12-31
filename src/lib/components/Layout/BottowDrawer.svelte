<script lang="ts">
	import Portal from '$lib/components/Layout/Portal.svelte';
	import { fade, fly, slide } from 'svelte/transition';
	export let isVisible = false;
	export let backDropStyle = '';
	export let modalStyle = '';

	let button: HTMLElement | undefined;

	function Escape(event: KeyboardEvent) {
		if (event.key === 'Escape' && isVisible) {
			isVisible = false;
		}
	}
</script>

<svelte:window on:keydown={Escape} on:pointerdown={() => (isVisible = false)} />

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div bind:this={button} on:click|stopPropagation={() => (isVisible = !isVisible)}>
	<slot name="button" />
</div>

{#if isVisible}
	<Portal>
		<div class={`fixed inset-0 z-10 ${backDropStyle}`} />
		<div class="fixed z-10 inset-0 pointer-events-none">
			<div
				in:fly={{ y: 30, duration: 300 }}
				class={`fixed bg-white bottom-0 right-0 left-0 h-[80vh] rounded-[10px_10px_0_0] shadow-lg pointer-events-auto ${modalStyle}`}
				on:pointerdown|stopPropagation
			>
				<!-- Content -->
				<slot name="menu" />
			</div>
		</div>
	</Portal>
{/if}
