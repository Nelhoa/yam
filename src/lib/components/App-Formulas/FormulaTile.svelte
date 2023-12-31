<script lang="ts">
	import type { Formula } from '$lib/models/formulas/formula';
	import { slide } from 'svelte/transition';
	import Bin from '../Icon/Bin.svelte';

	export let formula: Formula;
	const { category, title } = formula;
</script>

<button
	class="group relative w-full flex flex-col items-start border-b border-black/[.07] hover:bg-blueBank/[.02] hover:border-b-blueBank/20 px-6"
	on:click
>
	<div class="grid grid-cols-[2fr_3fr_4fr_28px] w-full items-center gap-3 h-[34px]">
		<div class="grid grid-cols-[auto_1fr] gap-x-2 items-center">
			<div
				class="w-[8px] h-[8px] rounded-sm shrink-0"
				class:keyColor={category.type === 'key'}
				class:incomeColor={category.type === 'income'}
				class:outcomeColor={category.type === 'outcome'}
			/>
			<div class="text-black w-full truncate text-left">{category.name}</div>
		</div>
		<div class="text-black/70 text-left truncate">{title}</div>
		<div class="h-full overflow-x-auto">
			<div class="flex flex-wrap gap-1 h-full items-center">
				{#each formula.checkedCategories as checkCategory}
					<div
						class="p-1 py-[1px] text-xs font-semibold text-white rounded-sm shrink-0"
						class:incomeColor={checkCategory.type === 'income'}
						class:outcomeColor={checkCategory.type === 'outcome'}
						class:keyColor={checkCategory.type === 'key'}
					>
						{checkCategory.name}
					</div>
				{/each}
			</div>
		</div>
		<button
			on:click|stopPropagation={() => formula.delete()}
			class="p-[6px] bg-black/[.04] rounded hover:bg-red-500/5 text-black/30 hover:text-red-500 hidden group-hover:flex justify-center items-center"
			><Bin width={10} /></button
		>
	</div>

	{#if formula.checkedCategories.length > 0}{/if}
</button>

<style lang="postcss">
	.incomeColor {
		@apply bg-green-500/70 group-hover:bg-green-500;
	}

	.outcomeColor {
		@apply bg-red-500/70 group-hover:bg-red-500;
	}

	.keyColor {
		@apply bg-blueBank/70 group-hover:bg-blueBank;
	}
</style>
