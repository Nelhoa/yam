<script context="module" lang="ts">
	type Component = { id: number; close: Function };
	const elements = new Set<Component>();
	let idSetter = 0;
	function getComponent(closeFunction: Function) {
		idSetter++;
		const component: Component = { id: idSetter, close: closeFunction };
		elements.add(component);
		return component;
	}
</script>

<script lang="ts">
	import type { Organisation } from '$lib/models/structurals/organisation';
	import { newAlert } from '$lib/stores/alerts-store';
	import { z } from 'zod';

	export let type: 'income' | 'outcome' | 'key';
	export let organisation: Organisation;
	const minLenght = 2;
	const maxLenght = 25;

	let thisComponent = getComponent(close);
	let isActive = false;
	let name = '';
	let vat = 0;
	let nameSchema = z.string().min(minLenght).max(maxLenght);

	function addCategory() {
		const parse = nameSchema.safeParse(name);
		if (!parse.success)
			return newAlert(
				`Le titre d’une catégorie doit faire entre ${minLenght} et ${maxLenght} caractères`
			);
		organisation.categoriesManager.newCategory(name, vat, type);
		close();
	}

	function close() {
		isActive = false;
		name = '';
		vat = 0;
	}

	function open() {
		isActive = true;
		elements.forEach((item) => {
			if (item !== thisComponent) item.close();
		});
	}

	function handleFocusOut() {
		if (name.length === 0) close();
	}

	function handleKeydown(keyEvent: KeyboardEvent) {
		if (keyEvent.key === 'Escape') close();
	}
</script>

<svelte:window on:click={handleFocusOut} />

<div class="flex justify-start py-3">
	{#if !isActive}
		<button
			on:click|stopPropagation
			class="px-2 py-[1px] text-sm bg-black/[.03] hover:bg-blueBank/10 rounded"
			on:click={open}
			>+ Ajouter
		</button>
	{:else}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<form
			class="grid grid-cols-[1fr_auto_auto_auto] gap-x-2 gap-y-1 w-full"
			on:click|stopPropagation
			on:submit|preventDefault={addCategory}
		>
			<div class="text-sm text-black/60">Titre</div>
			<div class="text-sm text-black/60">TVA (%)</div>
			<div />
			<div />
			<!-- svelte-ignore a11y-autofocus -->
			<input
				bind:value={name}
				class="w-full focus:outline-none focus:shadow px-2 py-[2px] rounded-sm"
				type="text"
				autofocus={true}
				on:keydown={handleKeydown}
			/>
			<input
				bind:value={vat}
				class="w-[50px] focus:outline-none focus:shadow px-2 py-[2px] rounded-sm"
				type="text"
			/>
			<button
				class="px-2 h-full bg-blueBank/40 hover:outline hover:outline-1 hover:outline-blueBank text-blueBank30 font-semibold rounded"
				>v</button
			>
			<button
				class="px-2 h-full bg-black/10 font-semibold rounded hover:outline hover:outline-1 hover:outline-black/30"
				on:click={close}>×</button
			>
		</form>
	{/if}
</div>
