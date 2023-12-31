<script lang="ts">
	import { browser } from '$app/environment';
	import { alerts, deleteAlert } from '$lib/stores/alerts-store';
	import { flip } from 'svelte/animate';
	import { fade } from 'svelte/transition';
	$alerts = [];
	let position = 78;

	$: if (browser) {
		position = window.scrollY > 78 ? 0 : 78 - window.scrollY;
	}

	function changeStyle(element: HTMLElement) {
		setTimeout(() => element.classList.add('isOld'), 2500);
		setTimeout(() => element.classList.remove('transition-opacity', 'duration-1000'), 3000);
	}

	function changePosition() {
		position = window.scrollY > 78 ? 0 : 78 - window.scrollY;
	}
</script>

<svelte:window on:scroll={changePosition} />

<div
	class="fixed bottom-0 left-0 right-0 z-alert flex justify-start items-start flex-col pointer-events-none"
	style={`top: ${position}px;`}
>
	<div
		id="itemList"
		class={`flex flex-col-reverse gap-y-2 w-[300px] max-w-full max-h-[100%] overflow-y-scroll ${
			$alerts.length > 0 ? 'pointer-events-auto' : 'pointer-events-none'
		} p-5 pr-0`}
	>
		{#each $alerts as alert (alert.uuid)}
			<div
				class="grid grid-cols-[1fr_auto] gap-x-2 w-full p-2 bg-white dark:bg-blueBank60 dark:text-white rounded shadow-lg text-sm transition-opacity duration-1000"
				in:fade
				use:changeStyle
				animate:flip
			>
				<div class="break-words overflow-x-hidden max-h-[18vh] overflow-y-auto">
					{alert.message}
				</div>
				<button
					on:pointerdown|stopPropagation={() => deleteAlert(alert)}
					class="h-[20px] w-[20px] bg-blueBank/20 hover:bg-blueBank text-center text-white font-bold rounded"
				>
					×
				</button>
			</div>
		{/each}
		<div class="isOld hidden" />
	</div>
</div>

<style lang="postcss">
	.isOld {
		@apply opacity-30 hover:opacity-100;
	}
</style>
