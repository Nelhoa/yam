<script lang="ts">
	import { goto } from '$app/navigation';
	import { PUBLIC_SITE_TITLE } from '$env/static/public';
	import SignOut from '$lib/components/SignOut.svelte';
	import { countryCode } from '$lib/utils/Public/everyCountryCode';
	import { superForm } from 'sveltekit-superforms/client';

	export let data;
	let loading = false;
	const { form, errors, constraints, message, capture, restore, enhance } = superForm(data.form, {
		resetForm: false,
		taintedMessage: false,
		multipleSubmits: 'prevent',
		onSubmit: () => {
			loading = true;
		},
		onResult: () => {
			loading = false;
		}
	});

	$: console.log(loading);
	export const snapshot = { capture, restore };
	const profile = data.profile;
	if (profile?.email) $form.email = profile.email;
	if (profile?.phone) $form.phone = profile.phone;
	if (profile?.first_name) $form.firstName = profile.first_name;
	if (profile?.last_name) $form.lastName = profile.last_name;
	if (!$form.country) $form.country = 'France';
	if (!$form.countryCode) $form.countryCode = 'FR';
</script>

<svelte:head>
	<title>{PUBLIC_SITE_TITLE} | S’inscrire</title>
</svelte:head>

<div class=" text-lg font-semibold">
	{profile ? 'Finalisez votre inscription' : 'S’inscrire sur bankdata'}
</div>

<form use:enhance method="POST" class="mt-5 grid grid-cols-2 gap-3">
	<div class="col-span-2">
		<input
			class="signInput col-span-2"
			placeholder="Email"
			type="email"
			name="email"
			bind:value={$form.email}
			readonly={profile?.email ? true : false}
			{...$constraints.email}
			aria-invalid={$errors.email ? 'true' : undefined}
		/>
		{#if $errors.email}
			<div class="invalid">{$errors.email}</div>
		{/if}
	</div>
	<div>
		<input
			class="signInput col-span-1"
			placeholder="Prénom"
			type="text"
			name="firstName"
			readonly={profile?.first_name ? true : false}
			bind:value={$form.firstName}
			aria-invalid={$errors.firstName ? 'true' : undefined}
			{...$constraints.firstName}
		/>
		{#if $errors.firstName}
			<div class="invalid">{$errors.firstName}</div>
		{/if}
	</div>
	<div>
		<input
			class="signInput col-span-1"
			placeholder="Nom"
			type="text"
			name="lastName"
			readonly={profile?.last_name ? true : false}
			bind:value={$form.lastName}
			aria-invalid={$errors.lastName ? 'true' : undefined}
			{...$constraints.lastName}
		/>
		{#if $errors.lastName}
			<div class="invalid">{$errors.lastName}</div>
		{/if}
	</div>
	<div class="col-span-2">
		<input
			class="signInput col-span-2"
			placeholder="Entreprise"
			type="text"
			name="company"
			bind:value={$form.company}
			aria-invalid={$errors.company ? 'true' : undefined}
			{...$constraints.company}
		/>
		{#if $errors.company}
			<div class="invalid">{$errors.company}</div>
		{/if}
	</div>

	<div class="col-span-2 sm:col-span-1">
		<div
			class="grid w-full grid-cols-[65px_1fr] rounded border border-black/10 bg-white px-3 py-[2px] focus:shadow focus:outline-none dark:bg-white/10 dark:hover:border dark:hover:border-white/10 dark:focus:border dark:focus:border-white/5"
		>
			<select
				class="w-[45px] bg-white/0 p-0 focus:outline-none"
				name="countryCode"
				bind:value={$form.countryCode}
			>
				{#each countryCode as countryElement}
					<option class="dark:text-black" value={countryElement['Alpha-2 code']}
						>{countryElement['Alpha-2 code']}</option
					>
				{/each}
			</select>
			<input
				class="w-full bg-white/0 focus:outline-none"
				name="phone"
				placeholder="Téléphone"
				type="tel"
				bind:value={$form.phone}
				readonly={profile?.phone ? true : false}
				{...$constraints.phone}
				aria-invalid={$errors.phone ? 'true' : undefined}
			/>
		</div>
		{#if $errors.phone}
			<div class="invalid">{$errors.phone}</div>
		{/if}
	</div>
	<div class="col-span-2 sm:col-span-1">
		<select
			class="selectInput"
			name="country"
			placeholder="Pays"
			bind:value={$form.country}
			aria-invalid={$errors.country ? 'true' : undefined}
			{...$constraints.country}
		>
			{#each countryCode as countryElement}
				<option class="dark:text-black" value={countryElement.Country}
					>{countryElement.Country}</option
				>
			{/each}
		</select>
		{#if $errors.country}
			<div class="invalid">{$errors.country}</div>
		{/if}
	</div>
	<div class="col-span-2">
		<div class="col-span-2 grid grid-cols-[auto_1fr] items-start gap-2">
			<input
				type="checkbox"
				name="termsConsent"
				class="mt-2"
				{...$constraints.termsConsent}
				aria-invalid={$errors.termsConsent ? 'true' : undefined}
			/>
			<div class="text-[15px] text-black/70 dark:text-white/70">
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				En cochant cette case vous déclarez avoir lu et accepté
				<span
					class="cursor-pointer font-semibold text-blueBank"
					on:click={() => window.open('/legal/cgu')}
					>nos Conditions Générales d’Utilisation (CGU)</span
				>.
			</div>
		</div>
		{#if $errors.termsConsent}
			<div class="invalid">{$errors.termsConsent}</div>
		{/if}
	</div>
	<button
		class="col-span-2 rounded bg-blueBank py-1 font-semibold text-white hover:shadow-lg hover:shadow-blueBank/20"
		disabled={loading}>{loading ? 'En cours...' : 'S’inscrire gratuitement'}</button
	>
	{#if $message}
		<div class="invalid col-span-2">{$message}</div>
	{/if}
</form>

<div class="mt-5">
	{#if profile}
		<SignOut
			redirect="/sign-in"
			buttonText="Utiliser un autre compte"
			buttonStyles="px-3 py-[2px] bg-black/5 hover:bg-black/10 text-semibold rounded mt-3"
		/>
	{:else}
		<div>Déjà inscrit ?</div>
		<button
			class="text-semibold mt-3 rounded bg-black/5 px-3 py-[2px] hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20"
			on:click={() => goto('/sign-in')}>Se connecter</button
		>
	{/if}
</div>

<div class="mt-4 text-sm text-black/50 dark:text-white/50">
	Les données que vous nous fournissez sont traitées par les services clients et marketing de
	bankdata aux fins de nous adresser vos demandes, accéder à nos ressources en ligne, utiliser notre
	Logiciel. Ces données nous permettent de vous envoyer des offres commerciales et marketing. Pour
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	en savoir plus, consultez
	<span
		class="cursor-pointer font-semibold text-blueBank"
		on:click={() => window.open('/legal/confidentialite')}>notre politique de confidentialité</span
	>.

	<div class="mt-2">
		Vous pouvez à tout moment demander l’accès, la rectification, la limitation, et l’effacement de
		vos données, ou retirer votre consentement. Pour exercer ces droits, contactez-nous à l’adresse
		contact@bank-data.app.
	</div>
</div>
