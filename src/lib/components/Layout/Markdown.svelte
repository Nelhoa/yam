<script lang="ts">
	import SvelteMarkdown from 'svelte-markdown';

	export let content: String;
</script>

<div class="markdown">
	<SvelteMarkdown source={content} />
</div>

<style lang="postcss">
</style>
