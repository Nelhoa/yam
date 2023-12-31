<script lang="ts">
	import { EventBankData } from '$lib/Events/bank-data-events';
	import OverLimitMenu from '$lib/components/App-Limits/OverLimitMenu.svelte';
	import type { limitMessageKey } from '$lib/components/App-Limits/util-limit';
	import CenteredModal from '$lib/components/Layout/Modal/CenteredModal.svelte';
	import type { ModalElement } from '$lib/components/Layout/Modal/util-modal';
	import { organisation } from '$lib/stores/organisations-store';
	import { onDestroy, onMount } from 'svelte';

	let LimitModal: ModalElement;
	let limitMessageKey: limitMessageKey = 'default';

	function overLimit(event: Event) {
		limitMessageKey = EventBankData.getDetails(event, 'OverLimit');
		LimitModal?.open();
	}

	onMount(() => EventBankData.listen('OverLimit', overLimit));
	onDestroy(() => EventBankData.remove('OverLimit', overLimit));
</script>

<div class="hidden">
	{#if $organisation}
		<CenteredModal
			bind:Modal={LimitModal}
			backdropStyles="bg-black/10"
			modalStyles="p-5 max-w-[90vw] w-[350px] border border-blueBank"
		>
			<svelte:fragment slot="menu">
				<OverLimitMenu
					on:close={() => LimitModal?.close()}
					bind:limitMessageKey
					organisation={$organisation}
				/>
			</svelte:fragment>
		</CenteredModal>
	{/if}
</div>
