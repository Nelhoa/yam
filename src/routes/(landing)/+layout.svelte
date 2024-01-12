<script lang="ts">
	import { fade } from 'svelte/transition';
	export let data;
</script>

<div class="h-screen overflow-x-auto">
	<slot />
</div>
