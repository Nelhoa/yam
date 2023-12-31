<script lang="ts">
	import BulletCategory from '$lib/components/App-Categories/BulletCategory.svelte';
	import Cross from '$lib/components/Icon/Cross.svelte';
	import Validate from '$lib/components/Icon/Validate.svelte';
	import Modal from '$lib/components/Layout/Modal/Modal.svelte';
	import type { Category } from '$lib/models/categories/category';
	import type { Transaction } from '$lib/models/datas/transaction';
	import type { Organisation } from '$lib/models/structurals/organisation';
	import { cn } from '$lib/utils/cn';
	import { createEventDispatcher } from 'svelte';
	import { fly, slide } from 'svelte/transition';
	import type { ModalElement } from '../Layout/Modal/util-modal';
	import { wait } from '$lib/utils/Public/wait';
	import { getNextTabElement } from '$lib/utils/Public/Helpers/getNextTabElement';

	let search = '';
	let ModalElement: ModalElement;
	$: isModalVisible = ModalElement?.isVisible;
	let searchInput: HTMLInputElement;
	let searchInputFocused = false;
	let categoryButtonsDiv: HTMLDivElement;
	let invertButton: HTMLButtonElement | undefined;
	let width: number;
	$: button = ModalElement?.anchor;
	const dispatch = createEventDispatcher();

	export let reverseDisplay = false;
	export let disabled: boolean = false;
	export let buttonStyles = '';
	export let customButton = false;
	export let organisation: Organisation;
	export let transaction: Transaction | undefined = undefined;
	export let noKeyType: boolean = false;
	export let selectNextElement = true;
	export let mode: 'flip' | 'auto' = 'auto';
	const categories = organisation.categoriesManager.categories;
	const isAutoCategory = transaction?.isAutoCategory;
	export let selectedCategory: Category = $categories.find(
		(item) => item.getCoreCategoryId() === 'otherIncome'
	)!;

	$: filteredCategories = $categories.filter(
		(item) =>
			item.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()) &&
			typeToShow.includes(item.type) &&
			!['otherIncome', 'otherOutcome'].includes(String(item.identifier))
	);
	$: indexHighlightedCategory =
		search.length > 0 ? 0 : filteredCategories.findIndex((item) => item === selectedCategory);

	let isTransactionInverted = transaction?.isInverted;
	let isTransactionPositive = transaction && transaction?.amount > 0;
	$: typeToShow = !transaction
		? noKeyType
			? ['income', 'outcome']
			: ['income', 'outcome', 'key']
		: !isTransactionInverted
		? isTransactionPositive
			? ['income']
			: ['outcome']
		: isTransactionPositive
		? ['outcome']
		: ['income'];

	$: if (!$isModalVisible) search = '';

	function handleKeydown(e: KeyboardEvent) {
		if (!$isModalVisible) return;
		if (e.key === 'Enter' && searchInputFocused && search.length > 0)
			filteredCategories[0] && handleSelect(filteredCategories[0]);
		if (e.key === 'Enter' && searchInputFocused && search.length === 0)
			handleSelect(selectedCategory);
		if (e.key === 'ArrowUp') navigate(e, 'up');
		if (e.key === 'ArrowDown') navigate(e, 'down');
	}

	const getCategoryItems = () => categoryButtonsDiv?.querySelectorAll('button')!;
	let categoriesItem = getCategoryItems();
	const getFirstCategoryItem = () =>
		categoriesItem[indexHighlightedCategory + 1] ?? categoriesItem[indexHighlightedCategory];
	const getLastCategoryItem = () => categoriesItem[categoriesItem.length - 1];
	const getFocusedItemIndex = () => {
		let selectedIndex: number | undefined;
		categoriesItem.forEach((item, index) => {
			if (item === document.activeElement) selectedIndex = index;
		});
		return selectedIndex;
	};

	function navigate(event: KeyboardEvent, direction: 'up' | 'down') {
		event.preventDefault();
		categoriesItem = getCategoryItems();
		const selectedIndex = getFocusedItemIndex();

		if (direction === 'down') {
			if (selectedIndex === undefined) return getFirstCategoryItem()?.focus();
			const nextItem = categoriesItem[selectedIndex + 1];
			if (nextItem) return nextItem.focus();
			return invertButton?.focus();
		}
		if (direction === 'up') {
			if (document.activeElement === invertButton) return getLastCategoryItem()?.focus();
			if (selectedIndex === 0) return searchInput.focus();
			if (selectedIndex) return categoriesItem[selectedIndex - 1]?.focus();
			return categoriesItem[indexHighlightedCategory - 1]?.focus();
		}
	}

	async function handleSelect(category: Category) {
		ModalElement?.close();
		dispatch('select', { category, isTransactionInverted });
		if (!$button || !selectNextElement) return;
		await wait(15);
		const nextElement = getNextTabElement($button);
		if (nextElement) nextElement.focus();
	}

	function handleInvert() {
		isTransactionInverted = !isTransactionInverted;
		search = '';
		searchInput.focus();
	}

	function onSearchFocusMount(element: HTMLInputElement) {
		async function focusElement() {
			await wait(15);
			element.focus();
		}
		focusElement();
	}

	$: if ($isModalVisible) isTransactionInverted = transaction && transaction.isInverted;
</script>

<svelte:window on:keydown={handleKeydown} bind:innerWidth={width} />

<Modal
	{mode}
	bind:Modal={ModalElement}
	openOnFocus
	toolTipStyles="px-[10px] py-[5px] flex gap-2 max-w-[200px] items-center"
	modalStyles={cn(
		'p-[10px] w-[300px] max-w-[80vw] grid grid-rows-[auto_1fr_auto] gap-y-3 h-[350px] max-h-[50vh] shadow-blueBank50/[.15]',
		width <= 600 && 'grid-rows-[1fr_auto]'
	)}
	buttonStyles={cn(
		'grid h-full w-full grid-cols-[auto_1fr_auto] items-center gap-2 px-[10px] hover:bg-blueBank/5',
		$isModalVisible &&
			'bg-white outline outline-1 outline-blueBank/20 rounded shadow shadow-blueBank/30',
		{ 'border-b-2 border-dashed border-blueBank/30 pt-[2px]': $isAutoCategory && !$isModalVisible },
		buttonStyles
	)}
>
	<svelte:fragment slot="tooltip">
		<div>
			{selectedCategory.name}
		</div>
	</svelte:fragment>
	<svelte:fragment slot="button">
		{#if !customButton}
			{#if !reverseDisplay}
				<BulletCategory className="w-[6px] h-[6px]" type={selectedCategory.type} />
			{:else}
				<div />
			{/if}
			<div
				class={cn('truncate text-left font-semibold', {
					'text-black/40': ['otherIncome', 'otherOutcome'].includes(
						String(selectedCategory.identifier)
					)
				})}
			>
				{selectedCategory.name}
			</div>
			{#if reverseDisplay}
				<BulletCategory className="w-[6px] h-[6px]" type={selectedCategory.type} />
			{:else}
				<div />
			{/if}
			{#if $isAutoCategory}
				<button
					on:click|stopPropagation={() => handleSelect(selectedCategory)}
					class="flex h-[21px] w-[21px] items-center justify-center rounded-full bg-blueBank/[.15] pl-[1px] text-blueBank hover:bg-blueBank/30 hover:shadow hover:shadow-white"
				>
					<Validate width={14} />
				</button>
			{/if}
		{/if}
		<slot />
	</svelte:fragment>
	<svelte:fragment slot="menu">
		{#if width > 600}
			<div
				class={cn(
					'grid grid-cols-[1fr_auto] items-center rounded-sm border border-black/5 px-2 py-[2px]',
					searchInputFocused && 'shadow-sm shadow-blueBank50/10'
				)}
			>
				<input
					use:onSearchFocusMount
					type="text"
					placeholder="Rechercher"
					on:focusin={() => (searchInputFocused = true)}
					on:focusout={() => (searchInputFocused = false)}
					bind:value={search}
					bind:this={searchInput}
					class="focus:outline-none"
				/>

				<button
					class={cn(
						'hidden h-[18px] w-[18px] items-center justify-center rounded-sm bg-black/5 text-black/30 hover:bg-black/10 hover:text-black/40',
						{
							flex: search.length > 0
						}
					)}
					on:click={() => (search = '')}
				>
					<Cross width={10} />
				</button>
			</div>
		{/if}
		<div class="h-full overflow-x-hidden overflow-y-scroll">
			{#key isTransactionInverted}
				<div in:fly|local={{ x: 5 }} bind:this={categoryButtonsDiv} class="pb-5">
					{#each filteredCategories as category, index (category.identifier)}
						<button
							{disabled}
							transition:slide|local
							on:click={() => handleSelect(category)}
							class={cn(
								'group grid h-full w-full grid-cols-[auto_1fr_auto] items-center gap-2 py-[3px] pl-2 pr-1 outline-1 hover:bg-blueBank/5  focus:outline-blueBank/40',
								{
									'bg-blueBank/[.08] text-black hover:bg-blueBank/[.08]':
										searchInputFocused &&
										((search.length > 0 && index === 0) ||
											(search.length === 0 && selectedCategory === category))
								}
							)}
						>
							<BulletCategory className="w-[6px] h-[6px]" type={category.type} />
							<div
								class={cn('w-full truncate text-left text-[15.5px] font-medium text-black/70', {
									'text-black': selectedCategory === category
								})}
							>
								{category.name}
							</div>
							<div class="rounded-sm bg-black/[.03] px-1 py-[1px] text-sm text-black/30">
								{category.vatRate} %
							</div>
						</button>
					{/each}
				</div>
			{/key}
		</div>
		{#if transaction}
			<button
				class={cn(
					'rounded-sm bg-blueBank/5 px-[10px] py-[5px] text-left text-[15px] font-semibold focus:outline-1 focus:outline-blueBank/30',
					{
						'bg-green-500': isTransactionInverted && !isTransactionPositive,
						'bg-red-500': isTransactionInverted && isTransactionPositive,
						'text-white': isTransactionInverted
					}
				)}
				on:click={handleInvert}
				bind:this={invertButton}
			>
				<div>Affecter aux {transaction.amount > 0 ? 'décaissements' : 'encaissements'}</div>
			</button>
		{/if}
	</svelte:fragment>
</Modal>
