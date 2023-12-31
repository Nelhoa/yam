<script lang="ts">
	import { PUBLIC_SITE_TITLE } from '$env/static/public';
	import { superForm } from 'sveltekit-superforms/client';

	export let data;
	let loading = false;
	const { type, email } = data;
	const { form, enhance, constraints, errors, message } = superForm(data.form, {
		resetForm: false,
		taintedMessage: 'Êtes vous sûr de vouloir quitter cette page sans vérifier votre code ?',
		multipleSubmits: 'prevent',
		onSubmit: () => {
			loading = true;
		},
		onResult: () => {
			loading = false;
		}
	});
</script>

<svelte:head>
	<title>{PUBLIC_SITE_TITLE} | Vérifier le code</title>
</svelte:head>

<div class="flex flex-col items-center">
	<div class="mb-3 text-center text-balance">
		Un code vous a été envoyé par email à <span class="font-semibold text-blueBank">{email}</span>.
	</div>
	<div class="mb-3 text-center text-balance">
		Pensez à regarder dans vos spams. Saisissez-le ci-dessous pour accéder à l’application.
	</div>
	<form use:enhance method="post" class="flex flex-col items-center">
		<div class="mb-4">
			<input
				placeholder="Votre code : XXXXXX"
				class="signInput text-center"
				type="text"
				minlength="6"
				maxlength="6"
				name="otp"
				bind:value={$form.otp}
				{...$constraints.otp}
			/>
			{#if $errors.otp}
				<div class="invalid">{$errors.otp}</div>
			{/if}
		</div>
		<button class="col-span-2 rounded bg-blueBank px-3 py-1 font-semibold text-white"
			>{loading ? 'En cours...' : 'Vérifier votre code'}</button
		>
		{#if $message}
			<div class="invalid">{$message}</div>
		{/if}
	</form>
</div>
