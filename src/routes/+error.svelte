<script>
	import { page } from '$app/stores';
	import { PUBLIC_TITLE } from '$env/static/public';
	import DarkModeToggle from '$lib/components/DarkModeToggle.svelte';
	const siteTitle = PUBLIC_TITLE;
</script>

<div class="flex justify-center p-12 text-center dark:text-white">
	<div class="mt-[15vh] flex w-[90%] max-w-[400px] flex-col items-center gap-y-5">
		<a href="/" class="-mb-4 font-poppins text-lg font-bold">
			{siteTitle}<span class="text-blueBank">.app</span>
		</a>
		<div class="flex items-center gap-x-4">
			<div>
				<DarkModeToggle largeButton={false} />
			</div>
			<div class="font-poppins text-4xl font-bold">
				Status {$page.status}
			</div>
		</div>

		<div class="text-lg text-balance">
			{$page.error?.message}
		</div>
		<a href="/">
			<button
				class="mt-5 rounded bg-blueBank/20 px-3 py-1 text-lg font-semibold hover:bg-blueBank/30"
			>
				Revenir à la page d’accueil
			</button>
		</a>
	</div>
</div>
