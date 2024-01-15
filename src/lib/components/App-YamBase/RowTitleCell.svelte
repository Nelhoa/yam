<script lang="ts">
	import type { AnyCell } from '$lib/models/Cells';
	import { cellClicked } from '$lib/models/store-cell-clicked';
	import { cn } from '$lib/utils/cn';
	import { col } from './colors';

	export let cell: AnyCell;
	export let index: number;

	$: highlight = $cellClicked?.name === cell.name;
	$: theme = col[index % 2]!;
	$: color = highlight ? theme.highlighted : theme.normal;
</script>

<div
	style={`background-color: ${color}`}
	class={cn(
		'font-regular  flex h-[38px] w-full items-center truncate border-b-[1.5px] border-r-[1.5px] border-b-black/[.15] border-r-black/[.15] px-3 text-[14px] font-semibold',
		highlight && 'relative z-[20]'
	)}
>
	{cell.name}
</div>
