<script lang="ts">
	import { computePosition, autoPlacement, shift, offset } from '@floating-ui/dom';
	import type { Organisation } from '$lib/models/structurals/organisation';
	import type dayjs from 'dayjs';
	import { toolTipAnchor, toolTipIndex, toolTipShow } from './chart-util-stores';
	import Portal from '../Layout/Portal.svelte';
	import { displayCurrency } from '$lib/utils/Public/Helpers/displayHelpers';
	import { get } from 'svelte/store';
	import { fade } from 'svelte/transition';
	import { tweened } from 'svelte/motion';
	import { commitsPatern, estimatePatern, type MainChartTheme } from './chart-colors';
	import PatternColors from './PatternColors.svelte';
	import TooltipScenario from './TooltipScenario.svelte';

	export let dateArray: dayjs.Dayjs[];
	export let organisation: Organisation;
	export let theme: MainChartTheme;
	let tooltipElement: HTMLDivElement;
	$: scenario = organisation.selectedScenario;
	$: spansMap = $scenario.spansMap;
	$: currency = get(organisation.accounts)[0]?.row.currency ?? 'EUR';
	$: viewedScenarios = organisation.viewedScenarios;

	$: spanDate = dateArray[$toolTipIndex]?.format('YYYY-MM-DD');
	$: span = spanDate ? $spansMap.get(spanDate) : undefined;

	$: transactionIn = span?.totals.transactionsIn;
	$: estimateIn = span?.totals.estimatesKeptsIn;
	$: commitsIn = span?.totals.commitsIn;
	$: transactionOut = span?.totals.transactionsOut;
	$: estimateOut = span?.totals.estimatesKeptsOut;
	$: commitsOut = span?.totals.commitsOut;

	const xTween = tweened(0, { duration: 200 });
	const yTween = tweened(0, { duration: 200 });
	let actualIndex = 0;

	$: if (
		$toolTipAnchor &&
		$toolTipShow &&
		($toolTipIndex !== actualIndex || $xTween === 0) &&
		tooltipElement
	) {
		actualIndex = $toolTipIndex;
		computePosition($toolTipAnchor, tooltipElement, {
			placement: 'top',
			middleware: [offset(30), shift(), autoPlacement()]
		}).then(({ x, y }) => {
			$xTween = x;
			$yTween = y;
		});
	}
</script>

<Portal>
	{#if span && $toolTipShow}
		<div
			transition:fade={{ duration: 120 }}
			bind:this={tooltipElement}
			class="pointer-events-none fixed max-w-[250px] rounded bg-white/[.95] p-[10px] shadow-lg shadow-blueBank/20"
			style={`left: ${$xTween}px; top: ${$yTween}px`}
		>
			<div>
				<!-- Title -->
				<div class="font-semibold first-letter:uppercase">{span.title.long}</div>

				<!-- Data -->
				<div class="mt-1 grid grid-cols-[auto_auto_auto] gap-x-4">
					<!-- Réel -->
					<div>
						<div class="text-sm text-black/50">Réel</div>
						<div class="grid grid-cols-[auto_1fr] items-center gap-x-2">
							<div
								class="h-[15px] w-[15px] rounded"
								style="background-color: {theme.incomesSelected};"
							/>
							<div class="text-sm font-semibold">
								{displayCurrency($transactionIn, currency, 0)}
							</div>
							<div
								class="h-[15px] w-[15px] rounded"
								style="background-color: {theme.outcomesSelected};"
							/>
							<div class="text-sm font-semibold">
								{displayCurrency($transactionOut, currency, 0)}
							</div>
						</div>
					</div>

					<!-- Engagés -->
					<div>
						<div class="text-sm text-black/50">Engagé</div>
						<div class="grid grid-cols-[auto_1fr] items-center gap-x-2">
							<PatternColors
								className="h-[15px] w-[15px] rounded"
								pattern={commitsPatern(theme.incomesSelected)}
							/>
							<div class="text-sm font-semibold">{displayCurrency($commitsIn, currency, 0)}</div>

							<PatternColors
								className="h-[15px] w-[15px] rounded"
								pattern={commitsPatern(theme.outcomesSelected)}
							/>
							<div class="text-sm font-semibold">{displayCurrency($commitsOut, currency, 0)}</div>
						</div>
					</div>

					<!-- Estimé -->
					<div>
						<div class="text-sm text-black/50">Estimé</div>
						<div class="grid grid-cols-[auto_1fr] items-center gap-x-2">
							<PatternColors
								className="h-[15px] w-[15px] rounded"
								pattern={estimatePatern(theme.incomesSelected)}
							/>
							<div class="text-sm font-semibold">{displayCurrency($estimateIn, currency, 0)}</div>

							<PatternColors
								className="h-[15px] w-[15px] rounded"
								pattern={estimatePatern(theme.outcomesSelected)}
							/>
							<div class="text-sm font-semibold">{displayCurrency($estimateOut, currency, 0)}</div>
						</div>
					</div>
				</div>

				<!-- Fin du mois -->
				<div class="mt-2">
					<div class="mb-[5px] text-sm text-black/70">Fin du mois</div>
					<div class="mb-[2px]">
						<TooltipScenario scenario={$scenario} {currency} {spanDate} {theme} />
					</div>
					{#if span.isPresentOrFuturSpan}
						{#each $viewedScenarios as viewed}
							{#if viewed !== $scenario}
								<TooltipScenario
									scenario={viewed}
									{currency}
									{spanDate}
									refScenario={$scenario}
									{theme}
								/>
							{/if}
						{/each}
					{/if}
				</div>
			</div>
		</div>
	{/if}
</Portal>
