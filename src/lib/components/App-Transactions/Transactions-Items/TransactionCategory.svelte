<script lang="ts">
	import CategorySelector from '$lib/components/Atom-CustomInput/CategorySelector.svelte';
	import type { Category } from '$lib/models/categories/category';
	import type { Transaction } from '$lib/models/datas/transaction';
	import { cn } from '$lib/utils/cn';
	export let reverseDisplay = false;
	export let transaction: Transaction;
	export let styles = '';

	const category = transaction.category;
	let selectedCategory = $category;
	let loading: boolean;

	async function handleCategorySelect(e: CustomEvent) {
		loading = true;
		const previousCategory = $category;
		selectedCategory = e.detail.category as Category;
		const { success } = await transaction.updateCategory(selectedCategory);
		if (!success) selectedCategory = previousCategory;
		loading = false;
	}
</script>

<div class="h-full">
	<CategorySelector
		{reverseDisplay}
		disabled={loading}
		buttonStyles={cn('text-[14.5px]', styles)}
		on:select={handleCategorySelect}
		organisation={transaction.account.parentOrganisation}
		{selectedCategory}
		{transaction}
	/>
</div>
