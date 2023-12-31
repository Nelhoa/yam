<script lang="ts">
	import type { Span } from '$lib/models/spans/span';
	import type { Frequency } from '$lib/models/structurals/organisation';
	import { displayCurrency } from '$lib/utils/Public/Helpers/displayHelpers';
	import { cn } from '$lib/utils/cn';
	import { fly } from 'svelte/transition';

	export let span: Span;

	$: GlobalVariation = span.totals.spanGlobalVariation;
	$: endBalance = span.totals.endBalance;

	const SpanTypeTitles = {
		quarter: 'de trimestre',
		year: 'd’année',
		day: 'de journée',
		week: 'de semaine',
		month: 'de mois'
	};
	let frequency = span.parentOrganisation.frequency as Frequency;
</script>

<div class={cn('flex flex-wrap items-end gap-x-5 gap-y-1 border-b px-5 py-4')}>
	<div class={cn('text-[20px] font-semibold first-letter:uppercase')}>
		{span.title.long}
	</div>
	{#key $GlobalVariation}
		<div
			in:fly|local={{ y: 6, duration: 600 }}
			class={cn(
				'font-semibold',
				$GlobalVariation > 0 && 'text-green-500',
				$GlobalVariation < 0 && 'text-red-500',
				$GlobalVariation === 0 && 'hidden'
			)}
		>
			{$GlobalVariation > 0 ? '+' : ''}
			{displayCurrency($GlobalVariation, 'EUR')}
		</div>
	{/key}
	{#key $GlobalVariation}
		<div
			in:fly|local={{ y: 6, duration: 600, delay: 190 }}
			class="grid grid-cols-[auto_1fr] items-end gap-x-2"
		>
			<div class={cn('font-semibold')}>
				{displayCurrency($endBalance, 'EUR')}
			</div>
			<div class=" truncate text-sm opacity-50">
				Solde fin {SpanTypeTitles[frequency]}
			</div>
		</div>
	{/key}
</div>
