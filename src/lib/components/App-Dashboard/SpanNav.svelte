<script lang="ts">
	import type { Organisation } from '$lib/models/structurals/organisation';
	import Loader from '../Icon/Loader.svelte';
	import NextArrow from '../Icon/NextArrow.svelte';

	export let organisation: Organisation;
	let loading = false;

	async function move(offset: number) {
		loading = true;
		await organisation.displaceRange(offset);
		loading = false;
	}
</script>

<div class="relative flex h-full items-center gap-x-2">
	<button
		disabled={loading}
		on:click={() => move(-1)}
		class="rotate-180 text-blueBank/30 hover:text-blueBank focus:outline-none focus:drop-shadow-md"
	>
		<NextArrow width={23} /></button
	>
	<button
		disabled={loading}
		class=" text-blueBank/30 hover:text-blueBank focus:outline-none focus:drop-shadow-md"
		on:click={() => move(1)}><NextArrow width={23} /></button
	>
</div>
