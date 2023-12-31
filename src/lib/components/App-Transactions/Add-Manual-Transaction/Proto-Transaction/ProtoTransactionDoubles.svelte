<script lang="ts">
	import Modal from '$lib/components/Layout/Modal/Modal.svelte';
	import type { ProtoTransaction } from '$lib/models/proto-transaction/proto-transaction';
	import { cn } from '$lib/utils/cn';

	export let protoTransaction: ProtoTransaction;
	export let styles = '';
	const { doubles } = protoTransaction;
</script>

{#if $doubles}
	<Modal
		toolTipAsModal
		modalStyles="max-w-[90vw] w-[250px] p-3"
		buttonStyles={cn(
			'max-w-[100px] truncate text-right text-sm bg-yellow-200/50 rounded  font-semibold px-1',
			styles
		)}
	>
		<svelte:fragment slot="button"
			>{`${$doubles?.length} doublon${$doubles?.length > 1 ? 's' : ''}`}</svelte:fragment
		>
		<svelte:fragment slot="menu">
			<div class="mb-1 font-semibold leading-tight text-balance">
				{`${$doubles?.length} doublon${$doubles?.length > 1 ? 's' : ''} sur le compte sélectionné`}
			</div>
			<div>
				{#each $doubles as transaction}
					<div
						class={cn(
							'truncate border-b border-b-black/5 text-[15px]',
							!transaction.custom_name && 'first-letter:uppercase'
						)}
						title={transaction.custom_name ??
							transaction.informations?.toLocaleLowerCase() ??
							'Nom inconnu'}
					>
						{transaction.custom_name ??
							transaction.informations?.toLocaleLowerCase() ??
							'Nom inconnu'}
					</div>
				{/each}
			</div>
			<div class="mt-2 text-sm italic text-black/50 text-balance">Même date et même montant.</div>
		</svelte:fragment>
	</Modal>
{/if}
