<script lang="ts">
	import type { Account } from '$lib/models/banks/account';
	import type { Organisation } from '$lib/models/structurals/organisation';
	import Cross from '$lib/components/Icon/Cross.svelte';
	import Modal from '$lib/components/Layout/Modal/Modal.svelte';
	import { cn } from '$lib/utils/cn';
	import { fly, slide } from 'svelte/transition';
	import { ManualAccount } from '$lib/models/banks/account-manual';
	import { createEventDispatcher } from 'svelte';
	import type { ModalElement } from '../Layout/Modal/util-modal';
	import { wait } from '$lib/utils/Public/wait';
	import { getNextTabElement } from '$lib/utils/Public/Helpers/getNextTabElement';

	export let organisation: Organisation;
	export let selectedAccount: undefined | Account = undefined;
	export let disabled = false;
	export let buttonStyles = '';
	export let manualOnly = false;
	export let selectNextElement = true;
	const accounts = organisation.accounts;
	const dispatch = createEventDispatcher();
	let AccountSelectorModal: ModalElement;
	$: isVisible = AccountSelectorModal?.isVisible;
	$: button = AccountSelectorModal?.anchor;

	let search = '';
	let searchInput: HTMLInputElement;
	let searchInputFocused = false;
	let accountButtonsDiv: HTMLDivElement;

	$: filteredAccounts = $accounts.filter((item) => {
		const isIncludeInSearch = item
			.displayName()
			?.toLocaleLowerCase()
			.includes(search.toLocaleLowerCase());
		if (manualOnly) return isIncludeInSearch && item instanceof ManualAccount;
		return isIncludeInSearch;
	});
	$: selectedAccountIndex =
		search.length > 0 ? 0 : filteredAccounts.findIndex((item) => item === selectedAccount);

	$: if (searchInput) searchInput.focus();
	$: if (!$isVisible) search = '';

	function handleKeydown(e: KeyboardEvent) {
		if (!$isVisible) return;
		if (e.key === 'Enter' && searchInputFocused && search.length > 0)
			filteredAccounts[0] && handleSelect(filteredAccounts[0]);
		if (e.key === 'Enter' && searchInputFocused && search.length === 0)
			selectedAccount && handleSelect(selectedAccount);
		if (e.key === 'ArrowUp') navigate(e, 'up');
		if (e.key === 'ArrowDown') navigate(e, 'down');
	}

	function navigate(keybordEvent: KeyboardEvent, direction: 'up' | 'down') {
		keybordEvent.preventDefault();
		const focused = document.activeElement;
		const accountButtons = accountButtonsDiv.querySelectorAll('button')!;
		let selectedIndex: number | undefined;
		accountButtons.forEach((item, index) => {
			if (item === focused) selectedIndex = index;
		});
		if (direction === 'down') {
			if (selectedIndex === undefined) return accountButtons[selectedAccountIndex + 1]?.focus();
			const nextItem = accountButtons[selectedIndex + 1];
			if (nextItem) return nextItem.focus();
		}
		if (direction === 'up') {
			if (selectedIndex === undefined) return accountButtons[selectedAccountIndex - 1]?.focus();
			if (selectedIndex === 0) return searchInput.focus();
			if (selectedIndex) accountButtons[selectedIndex - 1]?.focus();
		}
	}

	async function handleSelect(account: Account) {
		selectedAccount = account;
		AccountSelectorModal?.close();
		dispatch('select', { account });
		await wait(20);
		if (!$button || !selectNextElement) return;
		const nextElement = getNextTabElement($button);
		if (nextElement) nextElement.focus();
	}
</script>

<svelte:window on:keydown={handleKeydown} />

<Modal
	openOnFocus
	{disabled}
	bind:Modal={AccountSelectorModal}
	modalStyles="my-1 p-[10px] w-[300px] max-w-[80vw] grid grid-rows-[auto_1fr_auto] gap-y-3 h-[200px] max-h-[50vh] shadow-blueBank50/[.15]"
	buttonStyles={cn(
		'grid h-full w-full grid-cols-[auto_1fr_auto] items-center gap-2 px-[10px] hover:bg-blueBank/5',
		isVisible &&
			$isVisible &&
			'bg-white outline outline-1 outline-blueBank/20 rounded shadow shadow-blueBank/30',
		buttonStyles
	)}
>
	<svelte:fragment slot="button">
		{#if selectedAccount}
			<img src={selectedAccount.logo} alt="" width="22" />
		{/if}
		<div class={cn('truncate text-left font-semibold')}>
			{selectedAccount?.displayName() ?? 'Sélectioner un compte'}
		</div>
	</svelte:fragment>
	<svelte:fragment slot="menu">
		<div
			class={cn(
				'grid grid-cols-[1fr_auto] items-center rounded-sm border border-black/5 px-2 py-[2px]',
				searchInputFocused && 'shadow-sm shadow-blueBank50/10'
			)}
		>
			<input
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
		<div class="h-full overflow-x-hidden overflow-y-scroll">
			<div in:fly|local={{ x: 5 }} bind:this={accountButtonsDiv} class="pb-5">
				{#each filteredAccounts as account, index (account.row.id)}
					<button
						{disabled}
						transition:slide|local
						on:click={() => handleSelect(account)}
						class={cn(
							'group grid h-full w-full grid-cols-[auto_1fr] items-center gap-2 py-[3px] pl-2 pr-1 outline-1 hover:bg-blueBank/5  focus:outline-blueBank/40',
							{
								'bg-blueBank/[.08] text-black hover:bg-blueBank/[.08]':
									searchInputFocused &&
									((search.length > 0 && index === 0) ||
										(search.length === 0 && selectedAccount === account))
							}
						)}
					>
						<img src={account.logo} width="18" alt="" />
						<div
							class={cn('w-full truncate text-left text-[15.5px] font-medium text-black/70', {
								'text-black': selectedAccount === account
							})}
						>
							{account.displayName()}
						</div>
					</button>
				{/each}
			</div>
		</div>
	</svelte:fragment>
</Modal>
