<script lang="ts">
	import Modal from '$lib/components/Layout/Modal/Modal.svelte';
	import MoonIcon from './Icon/MoonIcon.svelte';
	import SunIcon from './Icon/SunIcon.svelte';
	import type { ModalElement } from './Layout/Modal/util-modal';
	export let largeButton = true;
	let DarkModeToggleModal: ModalElement;
	const options = [
		{ value: 'dark', display: 'Sombre' },
		{ value: 'light', display: 'Clair' },
		{ value: 'system', display: 'Système' }
	];

	function handleSwitchDarkMode(theme: string) {
		DarkModeToggleModal?.close();
		if (theme === 'dark' || theme === 'light') {
			localStorage.setItem('theme', theme);
			theme === 'dark'
				? document.documentElement.classList.add('dark')
				: document.documentElement.classList.remove('dark');
		}
		if (theme === 'system') {
			localStorage.removeItem('theme');
			if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
				document.documentElement.classList.add('dark');
			} else {
				document.documentElement.classList.remove('dark');
			}
		}
	}
</script>

<div>
	<Modal bind:Modal={DarkModeToggleModal}>
		<button slot="button">
			{#if largeButton}
				<div
					class="flex items-center justify-between gap-x-3 rounded-full border px-4 py-2 hover:border-blueBank dark:border-white/30 dark:hover:border-blueBank"
				>
					Choix du thème
					<span class="hidden dark:inline-block"><MoonIcon /></span>
					<span class="inline-block dark:hidden"><SunIcon /></span>
				</div>
			{:else}
				<span class="hidden dark:inline-block"><MoonIcon /></span>
				<span class="inline-block dark:hidden"><SunIcon /></span>
			{/if}
		</button>

		<div class="flex flex-col" slot="menu">
			{#each options as option}
				<button
					class="dark:hover:bg-nightBlue4 px-5 py-2 hover:bg-blueBank/10"
					on:click={() => handleSwitchDarkMode(option.value)}>{option.display}</button
				>
			{/each}
		</div>
	</Modal>
</div>
