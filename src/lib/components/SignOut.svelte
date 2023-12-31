<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { supabase } from '$lib/utils/Public/supabaseClient';
	import { cn } from '$lib/utils/cn';
	export let buttonText = 'Se déconnecter';
	export let buttonStyles = '';
	export let redirect = '/';

	let loading = false;

	async function signOut() {
		try {
			loading = true;
			const { error: clientError } = await $page.data.sb.auth.signOut();
			const { error: serverOutError } = await serverSignOut();
			if (serverOutError) throw serverOutError;
			if (clientError) throw clientError;
			goto(redirect);
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message);
			}
		} finally {
			loading = false;
		}
	}

	async function serverSignOut() {
		const res = await fetch('/auth/sign-out');
		const response = await res.json();
		return response as ReturnType<typeof supabase.auth.signOut>;
	}
</script>

<button class={cn('', buttonStyles)} on:click={signOut}
	>{loading ? 'En cours...' : buttonText}</button
>
