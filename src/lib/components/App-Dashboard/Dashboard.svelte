<script lang="ts">
	import { Pane, Splitpanes } from 'svelte-splitpanes';
	import type { Organisation } from '$lib/models/structurals/organisation';
	import CashFlow from '../Chart-Main/CashFlow.svelte';
	import SpansTable from './SpansTable.svelte';
	import SpanPanel from './SpanPanel.svelte';
	import { fly } from 'svelte/transition';
	import { onMount } from 'svelte';

	export let organisation: Organisation;
	const selectedSpan = organisation.selectedSpan;
	let windowWidth: number;
	let show = false;

	onMount(() => (show = true));
</script>

<svelte:window bind:innerWidth={windowWidth} />

<div class="h-full w-full">
	<Splitpanes
		style={`overflow-y:auto`}
		theme="modern-theme"
		horizontal={windowWidth > 700 ? false : true}
	>
		<Pane>
			<Splitpanes theme="modern-theme" horizontal={true}>
				<Pane size={38}>
					{#if show}
						<div in:fly={{}} class="grid h-full bg-blueBank09/0">
							<div class="h-full w-full overflow-hidden pt-9">
								<CashFlow {organisation} />
							</div>
						</div>
					{/if}
				</Pane>
				<Pane>
					{#if show}
						<div
							in:fly={{ x: -20, delay: 100, duration: 200 }}
							class="h-full w-full bg-blueBank09/0"
						>
							<SpansTable {organisation} />
						</div>
					{/if}
				</Pane>
			</Splitpanes>
		</Pane>
		{#if $selectedSpan}
			<Pane size={windowWidth > 1000 ? (620 / windowWidth) * 100 : 50}>
				{#if show}
					<div class="h-full" in:fly={{ x: 20, delay: 300, duration: 200 }}>
						<SpanPanel {organisation} selectedSpan={$selectedSpan} />
					</div>
				{/if}
			</Pane>
		{/if}
	</Splitpanes>
</div>
