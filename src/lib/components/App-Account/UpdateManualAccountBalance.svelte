<script lang="ts">
	import type { ManualAccount } from '$lib/models/banks/account-manual';
	import { newAlert } from '$lib/stores/alerts-store';
	import type dayjs from 'dayjs';
	import { createEventDispatcher } from 'svelte';
	import { get } from 'svelte/store';
	import DatePicker from '../Atom-CustomInput/DatePicker.svelte';
	import type { ModalElement } from '../Layout/Modal/util-modal';
	import { openLimitMenu } from '../App-Limits/util-limit';
	import CustomInput from '../Atom-CustomInput/CustomInput.svelte';
	import { displayCurrency } from '$lib/utils/Public/Helpers/displayHelpers';
	import CenteredModal from '../Layout/Modal/CenteredModal.svelte';
	import { cn } from '$lib/utils/cn';
	import LimitLocker from '../App-Limits/LimitLocker.svelte';
	import Loader from '../Icon/Loader.svelte';
	import Error from '../../../routes/+error.svelte';
	const dispatch = createEventDispatcher();

	export let account: ManualAccount;
	$: manualAccountLimitExceeded = account.parentOrganisation.limits.manualAccountLimitExceeded;
	let date: dayjs.Dayjs | undefined = get(account.balanceDate);
	let balance: number;
	let MenuModal: ModalElement;
	let error: string | undefined;
	let loading = false;

	async function handleClick() {
		error = undefined;
		if ($manualAccountLimitExceeded) {
			MenuModal?.close();
			return openLimitMenu('manualAccountOverLimit');
		}

		if (!(date && typeof balance === 'number' && !isNaN(balance) && balance !== Infinity))
			return (error = 'Informations manquantes');

		try {
			loading = true;
			await account.updateBalance(date, balance);
			loading = false;
			dispatch('acountUpdated');
			MenuModal?.close();
			return;
		} catch (err) {
			loading = false;
			error = 'Une erreur est survenue lors de la mise à jour du compte';
			console.error({ err });
		}
	}

	function displayAmount(value: any) {
		return displayCurrency(value, 'EUR');
	}
</script>

<CenteredModal
	bind:Modal={MenuModal}
	buttonStyles="bg-blueBank text-white font-semibold rounded px-3"
	modalStyles="p-5 max-w-[90vw] w-[450px] flex flex-col gap-3"
	backdropStyles="bg-black/10"
>
	<svelte:fragment slot="button">Mettre à jour</svelte:fragment>
	<svelte:fragment slot="menu">
		<div class="@container">
			<div class="mb-3">
				<div class="text-[17px] font-semibold">Mettre à jour le compte</div>

				{#if error}
					<div class="mt-1 text-sm font-semibold text-red-500">{error}</div>
				{/if}
			</div>
			<div class="relative grid grid-cols-1 gap-[6px] gap-x-3 @sm:grid-cols-2">
				<div>
					<div class="label">Solde du compte</div>
					<CustomInput
						focus
						bind:baseValue={balance}
						type="number"
						displayFunction={displayAmount}
						placeHolder={'Montant'}
						styles={cn('text-black border rounded h-[30px] w-full text-left')}
						placeHolderStyles="text-black/60"
					/>
				</div>
				<div>
					<div class="label">Date du solde</div>
					<DatePicker selectNextElement bind:date buttonStyles="h-[30px] w-full text-left" />
				</div>
			</div>
			<div class="mt-3 flex flex-col items-center">
				<button
					disabled={loading}
					class={cn(
						'mt-2 h-[30px] w-full rounded bg-blueBank font-semibold text-white focus:shadow-md focus:outline-1 focus:outline-blueBank20 disabled:bg-blueBank/50'
					)}
					on:click={handleClick}
				>
					{#if loading}
						<div class="flex w-full items-center justify-center">
							<Loader width={45} />
						</div>
					{:else}
						Mettre à jour
					{/if}
					<LimitLocker locked={$manualAccountLimitExceeded} />
				</button>
			</div>
		</div>

		<style lang="postcss">
			.label {
				@apply mb-[2px] text-[12px] font-semibold text-black/60;
			}
		</style>
	</svelte:fragment>
</CenteredModal>
