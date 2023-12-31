<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { mainChartTicksStore } from './chart-util-stores';

	$mainChartTicksStore;
</script>

<div
	class="flex h-full w-full flex-col-reverse items-end justify-between pb-[2px] pr-[10px] text-sm text-black/70"
>
	{#if $mainChartTicksStore}
		{#each $mainChartTicksStore as tick}
			<div>
				{tick.label}
			</div>
		{/each}
	{/if}
</div>
