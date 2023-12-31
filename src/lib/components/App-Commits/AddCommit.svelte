<script lang="ts">
	import type { Organisation } from '$lib/models/structurals/organisation';
	import CenteredModal from '../Layout/Modal/CenteredModal.svelte';
	import type { ModalElement } from '../Layout/Modal/util-modal';
	import AddOneCommit from './AddOneCommit.svelte';

	export let organisation: Organisation;
	let MenuModal: ModalElement;
</script>

<CenteredModal
	bind:Modal={MenuModal}
	modalStyles="p-5 max-w-[90vw] w-[450px] flex flex-col gap-3"
	backdropStyles="bg-black/10"
>
	<svelte:fragment slot="button">+ Engagé</svelte:fragment>
	<svelte:fragment slot="menu">
		<AddOneCommit {organisation} on:close={() => MenuModal?.close()} />
	</svelte:fragment>
</CenteredModal>
