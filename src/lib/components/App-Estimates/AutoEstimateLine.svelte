<script lang="ts">
	import type { AutoEstimate } from '$lib/models/datas/auto-estimate';
	import { createEventDispatcher } from 'svelte';
	import NextArrow from '../Icon/NextArrow.svelte';
	import { displayNumber } from '$lib/utils/Public/Helpers/displayHelpers';
	const dispatch = createEventDispatcher();

	export let autoEstimate: AutoEstimate;

	function goToFormula() {
		dispatch('goToFormula', { formula: autoEstimate.parentFormula });
	}
</script>

<div class="@container">
	<div
		class="group relative grid @sm:grid-cols-[auto_92px_1fr] grid-cols-[1fr_70px_1fr] bg-blueBank/[.04] opacity-60  items-center px-6 border-b h-[32px] border-black/5 dark:border-white/5  w-full shadow-md shadow-blueBank/0"
	>
		<div
			class="grid grid-cols-[auto_1fr] @md:w-[150px] w-[100px] justify-start items-center gap-x-2 px-3"
		>
			<div
				class="w-[6px] h-[6px] rounded-sm"
				class:keyColor={autoEstimate.category.type === 'key'}
				class:incomeColor={autoEstimate.category.type === 'income'}
				class:outcomeColor={autoEstimate.category.type === 'outcome'}
			/>
			<div class="font-semibold truncate">
				{autoEstimate.category.name}
			</div>
		</div>
		<div
			class="first-letter:uppercase truncate h-full  justify-end px-3 flex items-center text-black/70"
		>
			{displayNumber(autoEstimate.value, 0)}
		</div>
		<button
			class="group/button focus:outline-none text-left text-sm first-letter:uppercase h-full px-3 grid grid-cols-[auto_1fr_auto] items-center  hover:bg-blueBank/5"
			on:click={goToFormula}
		>
			<span class="font-mono text-sm text-blueBank font-semibold pr-1">f(x)</span>
			<div class="truncate text-black">{autoEstimate.parentFormula.title}</div>
			<div class="text-blueBank hidden group-hover/button:block">
				<NextArrow width={17} />
			</div>
		</button>
	</div>
</div>

<style lang="postcss">
	.incomeColor {
		@apply bg-green-500;
	}
	.outcomeColor {
		@apply bg-red-500;
	}
	.keyColor {
		@apply bg-blueBank;
	}
</style>
