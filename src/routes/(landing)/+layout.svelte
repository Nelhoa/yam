<script lang="ts">
	import { fade } from 'svelte/transition';
	export let data;
</script>

<div class="h-screen overflow-x-auto">
	<div class="my-5" in:fade>
		<slot />
	</div>
</div>
