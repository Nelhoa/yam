<script lang="ts">
	import { page } from '$app/stores';
	import type { Organisation } from '$lib/models/structurals/organisation';
	import { cn } from '$lib/utils/cn';
	import { createDemoDatas, deleteDemoDatas } from './demo-datas-functions';

	export let buttonStyles = '';
	export let organisation: Organisation;
	$: isDemoEnabled = organisation.isDemoEnabled;
	let loading = false;

	async function handleClick() {
		loading = true;
		const load = $isDemoEnabled
			? deleteDemoDatas(organisation, $page.data.sb)
			: createDemoDatas(organisation, $page.data.sb);
		await load;
		loading = false;
	}
</script>

<button
	class={cn(
		'rounded bg-yellow-500/80 px-3 py-[2px]  text-[15px] font-semibold text-white hover:bg-yellow-500/100 focus:shadow focus:outline-none disabled:bg-black/20',
		buttonStyles
	)}
	disabled={loading}
	on:click={handleClick}
>
	{#if loading}
		Chargement en cours...
	{:else if $isDemoEnabled}
		Supprimer les données de démonstration
	{:else}
		Créer les données de démonstration
	{/if}
</button>
