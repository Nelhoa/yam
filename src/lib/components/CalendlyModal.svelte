<script>
	import { PUBLIC_SITE_URL } from '$env/static/public';
	import CenteredModal from './Layout/Modal/CenteredModal.svelte';
	let windowHeight = 500;
	let windowWidth = 430;
</script>

<svelte:window bind:innerHeight={windowHeight} bind:innerWidth={windowWidth} />
<CenteredModal
	backdropStyles="dark:bg-blueBank90/40 bg-blueBank60/30"
	modalStyles="h-[700px] max-h-[80%] shadow-blueBank/20 shadow-lg rounded-xl"
>
	<svelte:fragment slot="button">
		<slot />
	</svelte:fragment>

	<iframe
		slot="menu"
		class="h-full bg-white"
		title="Calendly"
		width={Math.min(430, windowWidth * 0.9)}
		height={windowHeight / 2}
		src={`${PUBLIC_SITE_URL}/calendly`}
		frameborder="0"
	></iframe>
</CenteredModal>
