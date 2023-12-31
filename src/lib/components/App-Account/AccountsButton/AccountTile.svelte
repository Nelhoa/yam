<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Account } from '$lib/models/banks/account';
	import { displayCurrency } from '$lib/utils/Public/Helpers/displayHelpers';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let account: Account;
	const todayBalance = account.todayBalance;

	function goToAccount() {
		dispatch('close');
		goto(`/organisations/${account.parentOrganisation.info.id}/banks?account=${account.row.id}`);
	}
</script>

<button
	on:click={goToAccount}
	class="grid w-full grid-cols-[auto_1fr] items-center gap-[10px] rounded px-3 py-1 hover:bg-black/[.03]"
>
	<div class="flex h-[42px] items-center overflow-hidden rounded bg-white px-2 shadow">
		<img class="w-[27px]" src={account.logo} alt={account.displayName()} />
	</div>
	<div class="grid grid-rows-2">
		{#if account.bank && account.bank.isDemo}
			<div class="grid grid-cols-[1fr_auto]">
				<div class="truncate text-left text-[15px] font-semibold first-letter:uppercase">
					{account.displayName()}
				</div>
				<div
					class="flex items-center justify-center rounded bg-yellow-500 px-1 text-sm font-semibold text-white"
				>
					Demo
				</div>
			</div>
		{:else}
			<div class="truncate text-left text-[15px] font-semibold first-letter:uppercase">
				{account.displayName()}
			</div>
		{/if}
		<div class="-mt-[1px] text-left text-[14px]">
			{displayCurrency($todayBalance, account.row.currency ?? 'EUR')}
		</div>
	</div>
</button>
