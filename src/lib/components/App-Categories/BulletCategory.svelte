<script lang="ts">
	import type { categoryDB } from '$lib/types/customTypes';
	import { cn } from '$lib/utils/cn';

	export let type: categoryDB['Row']['type'] | null | undefined;
	export let className: string = '';
</script>

<div
	class={cn('h-[8px] w-[8px] rounded-sm', className)}
	class:key={type === 'key'}
	class:income={type === 'income'}
	class:outcome={type === 'outcome'}
/>

<style lang="postcss">
	.key {
		@apply bg-blueBank;
	}
	.income {
		@apply bg-green-500;
	}
	.outcome {
		@apply bg-red-500;
	}
</style>
