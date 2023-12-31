<script lang="ts">
	import type { Organisation } from '$lib/models/structurals/organisation';
	import Modal from '../Layout/Modal/Modal.svelte';
	import SwitchDemoButton from './SwitchDemoButton.svelte';

	export let organisation: Organisation;
	const isDemoEnabled = organisation?.isDemoEnabled;
</script>

{#if $isDemoEnabled}
	<Modal
		buttonStyles="flex h-full items-center rounded bg-yellow-500/80 hover:bg-yellow-500 px-2 font-semibold text-white text-sm focus:outline-none focus:shadow"
		modalStyles="p-4 max-w-[320px] text-sm"
	>
		<svelte:fragment slot="button">Démo</svelte:fragment>
		<svelte:fragment slot="menu">
			<div class="mb-3">
				<span class="font-semibold">Attention : </span>Supprimez bien les données de démo avant de
				construire votre prévisionnel !
			</div>
			<div class="mb-3">
				Les catégories de démonstrations et tous les éléments liés à celles-ci seront supprimés.
			</div>
			<SwitchDemoButton {organisation} buttonStyles="text-sm py-1" />
		</svelte:fragment>
	</Modal>
{/if}
