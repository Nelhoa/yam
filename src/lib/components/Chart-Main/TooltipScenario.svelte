<script lang="ts">
	import type { Scenario } from '$lib/models/scenario/scenario';
	import { displayCurrency, displayNumber } from '$lib/utils/Public/Helpers/displayHelpers';
	import { cn } from '$lib/utils/cn';
	import type { MainChartTheme } from './chart-colors';

	export let scenario: Scenario;
	export let refScenario: Scenario | undefined = undefined;
	export let currency: string;
	export let spanDate: string | undefined;
	export let theme: MainChartTheme;

	$: spansMap = scenario.spansMap;
	$: span = spanDate ? $spansMap.get(spanDate) : undefined;
	$: endOfMonth = span?.totals.endBalance;
	$: refSpansMap = refScenario?.spansMap;
	$: refSpan = spanDate && $refSpansMap ? $refSpansMap.get(spanDate) : undefined;
	$: refEndOfMonth = refSpan?.totals.endBalance;
</script>

<div class="grid grid-cols-[auto_1fr] gap-x-1">
	<div class="flex h-full w-[15px] items-center justify-center">
		<div
			class={cn('h-[7px] w-[7px] rounded-full', !refScenario && 'h-[11px] w-[11px]')}
			style="background-color: {scenario.color};"
		/>
	</div>
	<div class="grid grid-cols-[auto_auto_1fr] gap-x-[6px] text-sm text-black/40">
		<div
			class={cn({
				'font-semibold text-black': !refScenario,
				'text-red-500': !refScenario && $endOfMonth && $endOfMonth < 0
			})}
		>
			{displayCurrency($endOfMonth, currency, 0)}
		</div>
		{#if refScenario}
			<div class="truncate">{scenario.name}</div>
		{/if}
	</div>
</div>
