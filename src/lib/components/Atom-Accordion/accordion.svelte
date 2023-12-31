<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import AccordionItem from './accordion-item.svelte';
	import { setAccordionOptions } from './context';

	export let colapse = false;
	export let className = '';
	setAccordionOptions({ colapse });
</script>

<div class={cn('rounded bg-white p-2 shadow-md shadow-blueBank/10', className)}>
	<slot {AccordionItem} />
</div>
