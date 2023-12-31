<script lang="ts">
	import type { Organisation } from '$lib/models/structurals/organisation';
	import { fly } from 'svelte/transition';
	import AccountListButton from '$lib/components/App-Account/AccountsButton/AccountListButton.svelte';
	import DemoButtonModal from '../App-Demo/DemoButtonModal.svelte';
	import RunFormulasButton from '../App-Formulas/RunFormulasButton.svelte';
	import TrialInfo from '../App-Limits/TrialInfo.svelte';
	import ScenariosList from '../App-Scenarios/ScenariosList.svelte';
	import Loader from '../Icon/Loader.svelte';
	import { onMount } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import NextArrow from '../Icon/NextArrow.svelte';
	import { get } from 'svelte/store';
	import SpanNav from './SpanNav.svelte';

	export let organisation: Organisation;
	export let loading: boolean;
	export let isDashboard: boolean;
	$: displayRange = organisation.displayRange;
	let show = false;
	$: isDemoEnabled = organisation.isDemoEnabled;
	onMount(async () => {
		show = true;
	});

	async function moveRange(offset: number) {}
</script>

<div class="flex h-[26px] items-center gap-x-[10px]">
	{#if isDashboard && show}
		<div class="h-full" transition:fly={{ y: 10, delay: 50 }}>
			<ScenariosList {organisation} />
		</div>
		<div class="h-full" transition:fly={{ y: 10, delay: 100 }}>
			<AccountListButton {organisation} />
		</div>
		<div class="h-full" transition:fly={{ y: 10, delay: 150 }}>
			<RunFormulasButton {organisation} />
		</div>
		<div class="h-full" transition:fly={{ y: 10, delay: 200 }}>
			<SpanNav {organisation} />
		</div>
		<div class={cn('h-full', !$isDemoEnabled && 'hidden')} transition:fly={{ y: 10, delay: 250 }}>
			<DemoButtonModal {organisation} />
		</div>
		<div class="h-full" transition:fly={{ y: 10, delay: 300 }}>
			<TrialInfo {organisation} />
		</div>
	{/if}
	{#if loading}
		<div class="text-blueBank/40">
			<Loader />
		</div>
	{/if}
</div>
