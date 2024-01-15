<script lang="ts">
	let isFullScreen = false;

	function listenFullScreenChange(e: Event) {
		isFullScreen = !isFullScreen;
	}

	function openFullScreen() {
		const elem = document.getElementsByTagName('body')[0];
		if (!elem) return;
		if (elem.requestFullscreen) {
			elem.requestFullscreen();
		} else if (elem.mozRequestFullScreen) {
			/* Firefox */
			elem.mozRequestFullScreen();
		} else if (elem.webkitRequestFullscreen) {
			/* Chrome, Safari & Opera */
			elem.webkitRequestFullscreen();
		} else if (elem.msRequestFullscreen) {
			/* IE/Edge */
			elem.msRequestFullscreen();
		}
	}
	function exitFullScreen() {
		if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if (document.mozCancelFullScreen) {
			/* Firefox */
			document.mozCancelFullScreen();
		} else if (document.webkitExitFullscreen) {
			/* Chrome, Safari and Opera */
			document.webkitExitFullscreen();
		} else if (document.msExitFullscreen) {
			/* IE/Edge */
			document.msExitFullscreen();
		}
	}
</script>

<svelte:window on:fullscreenchange={listenFullScreenChange} />

{#if isFullScreen}
	<button on:click={exitFullScreen}>Exit</button>
{:else}
	<button on:click={openFullScreen}>Full</button>
{/if}
