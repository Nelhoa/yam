<script lang="ts">
	import CenteredModal from '$lib/components/Layout/Modal/CenteredModal.svelte';
	import type { ModalElement } from '$lib/components/Layout/Modal/util-modal';
	import type { Organisation } from '$lib/models/structurals/organisation';
	import AddManualAccountMenu from './ManualAccountAdd.svelte';

	export let AddManualAccountModal: ModalElement;
	export let organisation: Organisation;
</script>

<CenteredModal
	bind:Modal={AddManualAccountModal}
	modalStyles="p-5 max-w-[90vw] w-[450px] flex flex-col gap-3"
	backdropStyles="bg-black/10"
>
	<svelte:fragment slot="menu">
		<AddManualAccountMenu {organisation} on:accountCreated />
	</svelte:fragment>
</CenteredModal>
