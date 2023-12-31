<script lang="ts">
	import type { Span } from '$lib/models/spans/span';
	import dayjs from 'dayjs';

	export let span: Span;
	export let selectedSpan: Span | null = null;
	let isPast = span.start.isBefore(dayjs(), span.parentOrganisation.frequency);
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	class={`flex flex-col gap-y-2 p-2 ${
		isPast ? 'border border-blueBank/10 bg-black/[.02]' : 'bg-blueBank/10'
	} flex-shrink-0 cursor-pointer rounded hover:bg-blueBank/20`}
	class:selectedSpan={selectedSpan === span}
	on:click={() => (selectedSpan = selectedSpan === span ? null : span)}
>
	<div class="font-semibold">{span.start.format('Do MMM YYYY')}</div>
</div>

<style lang="postcss">
	.selectedSpan {
		@apply shadow-md shadow-blueBank/50 outline outline-[1.5px] outline-blueBank;
	}

	.titleBlock {
		@apply rounded-sm py-[1px] pr-1;
	}

	.outBlock {
		@apply rounded-sm border-b border-b-red-500 bg-white px-1 py-[1px] text-center;
	}
	.inBlock {
		@apply rounded-sm border-b border-b-green-500 bg-white px-1 py-[1px] text-center;
	}
</style>
