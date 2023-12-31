<script lang="ts">
	import type { Organisation } from '$lib/models/structurals/organisation';
	import AccountTile from './AccountTile.svelte';
	import Menu from '../AddMenu/Menu.svelte';

	export let organisation: Organisation;
	const accounts = organisation.accounts;
</script>

<div class="mt-2 flex max-h-[40vh] flex-col overflow-y-auto">
	{#each $accounts as account}
		<div>
			<AccountTile {account} on:close />
		</div>
	{/each}

	<div class="p-3 pt-2">
		<Menu
			on:close
			iconStyles="text-blueBank/50"
			buttonStyles="w-full border border-blueBank/20 rounded bg-blueBank/10 py-[4px] font-semibold hover:bg-blueBank/20 text-black"
			{organisation}>Ajouter un compte</Menu
		>
	</div>
</div>
