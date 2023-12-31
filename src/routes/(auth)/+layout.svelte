<script>
	import BankDataLogo from '$lib/components/Icon/BankDataLogo.svelte';
</script>

<div
	class="flex h-screen w-full flex-col items-center justify-center bg-blueBank/10 dark:bg-blueBank70/60"
>
	<div class="m-auto grid max-h-[90vh] w-[90vw] max-w-[500px] grid-rows-[auto_1fr_auto] gap-y-6">
		<div class="flex w-full flex-col items-center">
			<a href="/">
				<BankDataLogo width={180} />
			</a>
		</div>
		<div
			class="overflow-y-auto rounded bg-white/80 p-6 shadow-lg shadow-blueBank/10 dark:bg-blueBank90/70"
		>
			<slot />
		</div>
		<div class="flex w-full flex-col items-center">
			<a class="text-[15px] text-black/50 dark:text-white/50" href="/">Retour à la page d’accueil</a
			>
		</div>
	</div>
</div>
