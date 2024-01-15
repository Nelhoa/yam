<script lang="ts">
	import { page } from '$app/stores';
	import Auth from '$lib/components/GithubAuth.svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import { PUBLIC_SITE_TITLE } from '$env/static/public';

	export let data;
	let loading = false;
	const { form, enhance, constraints, errors, message } = superForm(data.form, {
		resetForm: false,
		onError: 'apply',
		taintedMessage: false,
		multipleSubmits: 'prevent',
		onSubmit: () => {
			loading = true;
		},
		onResult: () => {
			loading = false;
		}
	});

	onMount(() => {
		if ($page.data.session) {
			goto('/organisations');
		}
	});

	function logIn(e: HTMLDivElement) {
		goto('/organisations');
	}
</script>

<svelte:head>
	<title>{PUBLIC_SITE_TITLE} | Connexion</title>
</svelte:head>

<div class="flex w-full flex-col items-center">
	<div class="mb-3 font-semibold">Se connecter à bankdata</div>
	<form class=" w-full" method="POST" use:enhance>
		<div class="mb-3">
			<input
				placeholder="Saisissez votre adresse email"
				class=" h-[40px] w-full rounded-default border border-black/10 bg-white/50 px-3 py-2 text-center hover:bg-white hover:shadow-black/20 focus:shadow-black/30 focus:outline-none dark:bg-white/10 dark:text-white dark:focus:border dark:focus:border-white/10"
				type="email"
				name="email"
				bind:value={$form.email}
				{...$constraints.email}
			/>
			{#if $errors.email}
				<div class="invalid">{$errors.email}</div>
			{/if}
		</div>
		<button
			class="mb-2 h-[40px] w-full rounded-default bg-blueBank px-3 py-2 font-semibold text-white shadow hover:bg-blueBank/95 hover:shadow-black/30 focus:shadow-black/30 focus:outline-none"
			disabled={loading}>{loading ? 'En cours...' : 'Se connecter'}</button
		>
		{#if $message}
			<div class="invalid">{$message}</div>
		{/if}
	</form>
	<div class="flex justify-center text-black/60 dark:text-white/70">Ou</div>
	<div class="mt-2 w-full">
		<Auth />
	</div>

	<div class="mt-8 flex flex-col items-center">
		<div class="mb-3 text-[16px] font-semibold text-black/50 dark:text-white/60">
			Pas encore de compte ?
		</div>
		<div class="flex gap-3">
			<button
				on:click={() => goto('/sign-up')}
				class="mb-5 rounded bg-blueBank/20 px-3 py-[6px] text-[15px] font-semibold text-black hover:bg-blueBank/10 hover:shadow-lg hover:shadow-blueBank/30 dark:bg-blueBank/20 dark:text-white/70 dark:hover:bg-blueBank/50 dark:hover:text-white dark:hover:shadow-none lg:text-[16px]"
				>S’inscrire gratuitement</button
			>
		</div>
	</div>

	{#if data.session}
		<div use:logIn />
	{/if}
</div>

<style lang="postcss">
	.signInput {
		@apply w-full rounded border border-black/10 bg-white px-3 py-[2px] focus:shadow focus:outline-none disabled:border-black/5 disabled:bg-white/20 disabled:text-black/50;
	}

	.invalid {
		@apply px-[2px] text-sm font-semibold text-red-500;
	}
</style>
