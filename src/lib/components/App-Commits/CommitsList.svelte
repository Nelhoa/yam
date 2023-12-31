<script lang="ts">
	import type { Span } from '$lib/models/spans/span';
	import { onMount } from 'svelte';
	import CommitLine from './CommitLine.svelte';

	export let span: Span;
	$: commits = span.commitsManager.commits;

	onMount(() => {
		span.commitsManager.loadCommits();
	});
</script>

{#if $commits}
	<div class="mt-7">
		{#each $commits as commit}
			<CommitLine {commit} />
		{/each}
	</div>
{/if}
