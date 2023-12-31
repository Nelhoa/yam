<script lang="ts">
	import type { Span } from '$lib/models/spans/span';
	import AddCommit from './AddCommit.svelte';
	import CommitsList from './CommitsList.svelte';

	export let span: Span;
</script>

<div>
	<CommitsList {span} />
</div>

<div class="p-6">
	<AddCommit organisation={span.parentOrganisation} />
</div>
