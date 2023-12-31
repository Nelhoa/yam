<script lang="ts">
	import type { Organisation } from '$lib/models/structurals/organisation';
	import type dayjs from 'dayjs';
	import { newAlert } from '$lib/stores/alerts-store';
	import { createEventDispatcher } from 'svelte';
	import { MANUAL_ACCOUNT_LOGO } from '$lib/models/banks/account-manual';
	import Loader from '../../Icon/Loader.svelte';
	import DatePicker from '../../Atom-CustomInput/DatePicker.svelte';
	import CustomInput from '$lib/components/Atom-CustomInput/CustomInput.svelte';
	import { displayCurrency } from '$lib/utils/Public/Helpers/displayHelpers';
	import type { ciu } from '$lib/components/Atom-CustomInput/custom-input-utility';
	import { cn } from '$lib/utils/cn';
	export let organisation: Organisation;
	const dispatch = createEventDispatcher();

	let date: dayjs.Dayjs | undefined;
	let title = '';
	let balance: number | undefined;
	let loading = false;
	let error: string | undefined;

	async function createAccount() {
		if (loading) return;
		if (
			!(
				date &&
				typeof balance === 'number' &&
				!isNaN(balance) &&
				balance !== Infinity &&
				title.length >= 4
			)
		)
			return newAlert('Informations manquantes pour créer le nouveau compte manuel');

		try {
			loading = true;
			const newAccount = await organisation.newManualAccount(title, date!, balance!);
			dispatch('accountCreated', { account: newAccount });
			loading = false;
			return;
		} catch (error) {
			newAlert('Une erreur est survenue lors de la création de compte');
			console.error({ error });
			loading = false;
		}
	}

	const displayBalance = (value: ciu.Value) => displayCurrency(value, 'EUR');
</script>

<div class="@container">
	<div class="mb-3">
		<div class="flex gap-x-3">
			<img src={MANUAL_ACCOUNT_LOGO} class="w-[25px]" alt="Manual account icon" />
			<div class="text-[17px] font-semibold">Ajouter un compte manuel</div>
		</div>

		{#if error}
			<div class="mt-1 text-sm font-semibold text-red-500">{error}</div>
		{/if}
	</div>
	<div class="relative grid grid-cols-1 gap-[6px] gap-x-3 @sm:grid-cols-2">
		<div class="@sm:col-span-2">
			<div class="label">Nom du compte</div>
			<CustomInput
				focus
				bind:baseValue={title}
				type="text"
				placeHolder={'Nom du compte'}
				styles={cn('text-black border rounded h-[30px] w-full text-left')}
				placeHolderStyles="text-black/60"
			/>
		</div>
		<div>
			<div class="label">Solde du compte</div>
			<CustomInput
				bind:baseValue={balance}
				type="number"
				displayFunction={displayBalance}
				placeHolder={'Solde du compte'}
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
			on:click={createAccount}
		>
			{#if loading}
				<div class="flex w-full items-center justify-center">
					<Loader width={45} />
				</div>
			{:else}
				Créer le compte
			{/if}
		</button>
	</div>
</div>

<style lang="postcss">
	.label {
		@apply mb-[2px] text-[12px] font-semibold text-black/60;
	}
</style>
