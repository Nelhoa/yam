<script lang="ts">
	import OldCustomInput from '$lib/components/Atom-CustomInput/OLDCustomInput.svelte';
	import Bin from '../Icon/Bin.svelte';
	import type { Estimate } from '$lib/models/datas/estimate';
	import CategorySelector from '../Atom-CustomInput/CategorySelector.svelte';
	import type { Category } from '$lib/models/categories/category';

	let loading = false;
	export let estimate: Estimate;
	const { category } = estimate;
	let selectedCategory = $category;
	let isOpen = false;

	function deleteEstimate() {
		estimate.delete();
	}

	async function updateCategory(e: CustomEvent) {
		loading = true;
		selectedCategory = e.detail.category;
		const previousCategory = $category;
		const newCategory = e.detail.category as Category;
		const { success } = await estimate.updateCategory(newCategory);
		if (!success) selectedCategory = previousCategory;
		loading = false;
	}
</script>

<div class="@container">
	<div
		class="group relative grid h-[32px] w-full grid-cols-[1fr_70px_1fr_auto] items-center border-b border-black/5 px-6 shadow-md shadow-blueBank/0 @sm:grid-cols-[auto_92px_1fr_auto] dark:border-white/5"
		class:isOpen
	>
		<div class="absolute hidden h-full w-[100px] @sm:static @sm:block @md:w-[150px]">
			<CategorySelector
				disabled={loading}
				on:select={updateCategory}
				organisation={estimate.parentOrganisation}
				{selectedCategory}
			/>
		</div>
		<div class="h-full truncate text-left first-letter:uppercase">
			<OldCustomInput
				inputValue={estimate.info.value}
				className="text-right text-black/60"
				bind:isRowOpened={isOpen}
				update={(n) => estimate.updateValue(n)}
				branchName="estimate"
				inputType="number"
				alertEmpty={true}
			/>
		</div>
		<div
			class="grid h-full w-full grid-cols-[auto_1fr] items-center gap-x-1 truncate text-right first-letter:uppercase"
		>
			{#if estimate.info.is_demo}
				<div class="rounded bg-yellow-500/70 px-1 text-[12px] font-semibold text-white">Démo</div>
			{:else}
				<div />
			{/if}
			<div class="h-full w-full truncate text-left first-letter:uppercase">
				<OldCustomInput
					bind:inputValue={estimate.info.title}
					className="text-left text-black/60"
					bind:isRowOpened={isOpen}
					update={(n) => estimate.updateTitle(n)}
					branchName="estimate"
					inputType="text"
				/>
			</div>
		</div>

		<button
			class="hidden px-3 text-black/[.15] hover:text-black active:text-red-600 group-hover:flex"
			on:click={deleteEstimate}><Bin width={12} /></button
		>
	</div>
</div>

<style lang="postcss">
	.isOpen {
		opacity: 100;
		@apply shadow-blueBank/10;
	}
</style>
