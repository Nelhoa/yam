<script lang="ts">
	import type { Organisation } from '$lib/models/structurals/organisation';
	import _ from 'lodash';
	import Cell from '$lib/components/App-Cell/Cell.svelte';
	import type { Category } from '$lib/models/categories/category';
	import { MainChartScroll } from '$lib/stores/main-chart-scroll-store';
	import { cn } from '$lib/utils/cn';
	import tinycolor from 'tinycolor2';

	export let organisation: Organisation;
	const categories = organisation.categoriesManager.categories;
	const selectedScenario = organisation.selectedScenario;
	const selectedSpan = organisation.selectedSpan;
	let categoryHover: Category | undefined = undefined;
	let spanTableElement: HTMLDivElement;
	let spanTableHeaderElement: HTMLDivElement;
	$: spans = $selectedScenario.spansMap;
	$: displayedSpans = $selectedScenario.displayedSpans;
	$: sortedCategories = $categories.sort((a, b) => {
		switch (a.type) {
			case 'income':
				if (b.type !== 'income') return -1;
				return 0;
			case 'outcome':
				if (b.type === 'key') return -1;
				if (b.type === 'income') return 1;
				return 0;
			case 'key':
				if (b.type !== 'key') return 1;
				return 0;
		}
	});

	function handleMouseEnter(category: Category) {
		categoryHover = category;
	}

	function handleMouseLeave() {
		categoryHover = undefined;
	}

	$: if (spanTableElement) spanTableElement.scrollLeft = $MainChartScroll;
	$: if (spanTableHeaderElement) spanTableHeaderElement.scrollLeft = $MainChartScroll;

	function handleBodyScroll() {
		$MainChartScroll = spanTableElement.scrollLeft;
	}

	function handleHeaderScroll() {
		$MainChartScroll = spanTableHeaderElement.scrollLeft;
	}
</script>

{#if $spans}
	<div class="grid h-full w-full grid-rows-[auto_1fr] overflow-hidden">
		<!-- Header -->
		<div class="grid h-full grid-cols-[160px_1fr] pr-[6px] shadow-lg shadow-blueBank/5">
			<div
				class="cell categoryCell h-full overflow-hidden border-b border-r border-black/5 bg-blueBank09/[.5] px-4"
			/>
			<div
				class="noScrollBar overflow-x-auto overflow-y-hidden"
				on:scroll={handleHeaderScroll}
				bind:this={spanTableHeaderElement}
			>
				<div class="flex">
					{#each $displayedSpans as span}
						{@const isSelected = $selectedSpan === span}
						{@const isPresent = span.isPresentSpan}
						<button
							on:click={() => {
								if ($selectedSpan !== span) $selectedSpan = span;
							}}
							class={cn(
								'flex shrink-0 flex-col hover:bg-blueBank/[.03] focus:outline-none',
								isPresent && 'PresentSpanBorder',
								isSelected && 'bg-blueBank/5 '
							)}
						>
							<div class="cell spanCell w-full border-black/5 text-black/30">
								<span
									class={cn(
										`truncate text-center text-[13px] font-medium first-letter:uppercase`,
										isPresent && 'rounded bg-blueBank/40 px-1 pt-[1px] text-white',
										isSelected && 'text-black',
										isSelected && isPresent && 'bg-blueBank/70 text-white'
									)}
									style={isPresent &&
										`background-color: ${tinycolor(span.parentScenario.color)
											.setAlpha(isSelected ? 1 : 0.6)
											.toPercentageRgbString()};`}
								>
									{span.title.short}
								</span>
							</div>
						</button>
					{/each}
				</div>
			</div>
		</div>

		<!-- Body -->
		<div class="h-full w-full overflow-y-auto overflow-x-hidden">
			<div class="grid h-full grid-cols-[160px_1fr]">
				<div class="border-r bg-blueBank09/[.5] pb-5 shadow-lg shadow-blueBank/20">
					{#each sortedCategories as category}
						<div
							class="cell categoryCell grid grid-cols-[auto_1fr] items-center gap-2"
							class:categoryHover={categoryHover === category}
						>
							<div class={`h-[7px] w-[7px] rounded-sm ${category.type}`} />
							<div class="truncate text-[14px] font-medium">{category.name}</div>
						</div>
					{/each}
				</div>
				<div
					class="overflow-x-auto overflow-y-hidden pb-1"
					on:scroll={handleBodyScroll}
					bind:this={spanTableElement}
				>
					<div class="flex">
						{#each $displayedSpans as span}
							<button
								on:click={() => {
									if ($selectedSpan !== span) $selectedSpan = span;
								}}
								class="flex shrink-0 flex-col hover:bg-blueBank/[.03] focus:outline-none"
								class:PresentSpanBorder={span.isPresentSpan}
								class:spanSelected={span === $selectedSpan}
							>
								{#each sortedCategories as category}
									<!-- svelte-ignore a11y-no-static-element-interactions -->
									<div
										class="cell spanCell h-full w-full text-center text-sm text-black/[.55] hover:text-black hover:outline hover:outline-1 hover:outline-blueBank/20"
										class:categoryHover={categoryHover === category}
										on:mouseenter={() => handleMouseEnter(category)}
										on:mouseleave={() => handleMouseLeave()}
									>
										<Cell {span} {category} />
									</div>
								{/each}
							</button>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

<style lang="postcss">
	.income {
		@apply bg-green-500;
	}
	.outcome {
		@apply bg-red-500;
	}
	.key {
		@apply bg-blueBank;
	}

	.cell {
		@apply h-[34px] border-b border-b-black/[.03];
	}

	.categoryCell {
		@apply px-4;
	}

	.spanCell {
		@apply flex w-[85px] items-center justify-center;
	}

	.spanSelected {
		@apply bg-blueBank/5;
	}

	.categoryHover {
		@apply bg-blueBank/[.03];
	}

	.PresentSpanBorder {
		@apply border-l border-l-blueBank/30;
	}

	/* .selectedSpanHeader {
		@apply text-black;
	} */

	/* .presentSpanHeader.selectedSpanHeader {
		@apply bg-blueBank/70;
	} */
</style>
