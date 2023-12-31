<script lang="ts">
	import EstimateLine from './EstimateLine.svelte';
	import Loader from '$lib/components/Icon/Loader.svelte';
	import type { Span } from '$lib/models/spans/span';
	import { quintInOut, quintOut } from 'svelte/easing';
	import _, { sortBy } from 'lodash';
	import { get } from 'svelte/store';
	import type { Estimate } from '$lib/models/datas/estimate';
	import { flip } from 'svelte/animate';
	import { crossfade, slide } from 'svelte/transition';
	import AutoEstimateLine from './AutoEstimateLine.svelte';
	import CategorySelector from '../Atom-CustomInput/CategorySelector.svelte';
	import type { Category } from '$lib/models/categories/category';

	const [send, receive] = crossfade({
		duration: (d) => Math.sqrt(d * 2000),
		easing: quintInOut,

		fallback(node, params) {
			const style = getComputedStyle(node);
			const transform = style.transform === 'none' ? '' : style.transform;

			return {
				duration: 200,
				easing: quintOut,
				css: (t) => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`
			};
		}
	});

	export let span: Span;

	type EstimateGroup = { type: 'income' | 'outcome' | 'key' | undefined; title: string };
	const estimatesGroups: EstimateGroup[] = [
		{ type: 'income', title: 'Encaissements' },
		{ type: 'outcome', title: 'Décaissements' },
		{ type: 'key', title: 'Indicateurs Clés' },
		{ type: undefined, title: 'À catégoriser' }
	];

	let { estimates } = span.estimatesManager;
	let { autoEstimates } = span.autoEstimatesManager;

	async function addEstimates(e: CustomEvent) {
		const category = e.detail.category as Category;
		span.estimatesManager.newEstimate({}, category);
	}

	span.estimatesManager.loadEstimates();
	span.autoEstimatesManager.loadAutoEstimates();
</script>

<div class="mb-5 @container">
	{#if !$estimates || !$autoEstimates}
		<div class="m-5 text-blueBank/40">
			<Loader width={90} />
		</div>
	{:else if $estimates.length > 0 || $autoEstimates.length > 0}
		<div class="overflow-hidden">
			{#each estimatesGroups as group (group.type)}
				{@const filteredEstimates = $estimates.filter(
					(item) => get(item.category)?.type === group.type
				)}
				{@const filteredAutoEstimates = $autoEstimates.filter(
					(item) => item.category.type === group.type
				)}

				{#if (filteredEstimates && filteredEstimates.length > 0) || filteredAutoEstimates.length > 0}
					<div transition:slide|local class="mt-4">
						<div class="groupTitle">
							{group.title}
						</div>

						{#each filteredEstimates as estimate (estimate.info.uuid)}
							<div
								in:receive|local={{ key: estimate.info.uuid }}
								out:send|local={{ key: estimate.info.uuid }}
								animate:flip
								class="grid grid-cols-[1fr_auto]"
							>
								<EstimateLine {estimate} />
							</div>
						{/each}
						{#each filteredAutoEstimates as autoEstimate}
							<div>
								<AutoEstimateLine {autoEstimate} on:goToFormula />
							</div>
						{/each}
					</div>
				{/if}
			{/each}
		</div>
	{/if}
</div>

<div class="mt-5 flex justify-end pb-5">
	<CategorySelector
		buttonStyles="w-auto mx-5 mt-1 self-end rounded bg-blueBank/[.07] px-2 py-[3px] hover:bg-blueBank/10"
		on:select={addEstimates}
		customButton
		organisation={span.parentOrganisation}
	>
		<svelte:fragment>+ Ajouter un estimé</svelte:fragment>
	</CategorySelector>
</div>

<!-- 
{#if !$autoEstimates}
	<div class="text-blueBank/40 m-5">
		<Loader width={90} />
	</div>
{:else if $autoEstimates.length > 0}
	<div class="groupTitle">Générés</div>
	<div class="flex flex-col gap-y-2">
		{#each $autoEstimates as autoEstimate}
			<div class="px-2 py-1 bg-blueBank/10 mx-4 rounded">
				<div class="text-sm text-black/60">
					{autoEstimate.parentFormula.title}
				</div>
				<div>{displayNumber(autoEstimate.value)}</div>
			</div>
		{/each}
	</div>
{/if} -->
<style lang="postcss">
	.groupTitle {
		@apply mb-2 ml-5 text-black/40;
	}
</style>
