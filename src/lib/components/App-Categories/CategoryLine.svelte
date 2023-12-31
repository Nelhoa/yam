<script lang="ts">
	import OldCustomInput from '$lib/components/Atom-CustomInput/OLDCustomInput.svelte';
	import type { Category } from '$lib/models/categories/category';
	import { CoreCategory } from '$lib/models/categories/category-core';
	import { CustomCategory } from '$lib/models/categories/category-custom';
	import { cn } from '$lib/utils/cn';
	import type { ModalElement } from '../Layout/Modal/util-modal';
	import BulletCategory from './BulletCategory.svelte';
	import DeleteWarning from './DeleteWarning.svelte';

	export let category: Category;
	let DeleteWarningModal: ModalElement;
	$: isDeleteWarningVisible = DeleteWarningModal?.isVisible;
	let isOpen = false;

	function deleteCategory() {
		if (!category.isCore) {
			const deletedCategory: CustomCategory = category as CustomCategory;
			deletedCategory.delete();
		}
	}
</script>

<div class="@container">
	<div
		class="group relative grid h-[32px] w-full grid-cols-[auto_1fr_55px_45px] items-center rounded border border-b border-blueBank/0 px-2 shadow-md shadow-blueBank/5 dark:border-white/5"
		class:isOpen
		class:isCore={category instanceof CoreCategory}
	>
		<BulletCategory className="w-[7px] h-[7px] rounded-sm mr-3" type={category.type} />
		<div
			class="grid h-full grid-cols-[auto_1fr] items-center gap-x-1 truncate text-right first-letter:uppercase"
		>
			{#if category instanceof CustomCategory && category.isDemo}
				<div class="rounded bg-yellow-500/70 px-1 text-[12px] font-semibold text-white">Démo</div>
			{:else}
				<div />
			{/if}
			<OldCustomInput
				inputValue={category.name}
				className="text-left"
				bind:isRowOpened={isOpen}
				update={(n) => (category instanceof CustomCategory ? category.updateName(n) : n)}
				branchName="category"
				inputType="text"
				alertEmpty={true}
				disabled={category.isCore}
			/>
		</div>
		<div class="h-full truncate text-left first-letter:uppercase">
			<OldCustomInput
				inputValue={category.vatRate}
				className="text-right"
				bind:isRowOpened={isOpen}
				update={(n) => (category instanceof CustomCategory ? category.updateVatRate(n) : n)}
				branchName="category"
				inputType="number"
				alertEmpty={false}
				disabled={category.isCore}
			/>
		</div>

		{#if category.isCore}
			<div />
		{:else}
			<div class={cn('hidden group-hover:block', $isDeleteWarningVisible && 'block')}>
				<DeleteWarning {category} on:delete={deleteCategory} bind:DeleteWarningModal />
			</div>
		{/if}
	</div>
</div>

<style lang="postcss">
	.isOpen {
		opacity: 100;
		@apply shadow-blueBank/10;
	}
	.isCore {
		@apply bg-blueBank/5 shadow-blueBank/0;
	}
</style>
