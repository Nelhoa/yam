<script lang="ts">
	import GitHubLogo from './Icon/GitHubLogo.svelte';
	import { PUBLIC_SITE_URL } from '$env/static/public';
	import { page } from '$app/stores';

	let githubLoading = false;

	async function signInWithGitHub() {
		githubLoading = true;
		try {
			const { error } = await $page.data.sb.auth.signInWithOAuth({
				provider: 'github',
				options: {
					shouldCreateUser: false,
					redirectTo: `${PUBLIC_SITE_URL}/auth/callback`
				}
			});
			if (error) throw error;
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message);
			}
		}
	}
</script>

<div>
	<button
		on:click={signInWithGitHub}
		class="grid h-[40px] w-full grid-cols-[auto_auto] items-center justify-center gap-x-3 rounded-default bg-gitHubGrey px-3 py-2 font-semibold text-white shadow-md hover:bg-gitHubGrey/95 hover:shadow-black/30 focus:shadow-black/30 focus:outline-none dark:bg-white/10"
		disabled={githubLoading}
		><GitHubLogo />{githubLoading ? 'Connexion en cours...' : 'Se connecter via Github'}</button
	>
</div>
