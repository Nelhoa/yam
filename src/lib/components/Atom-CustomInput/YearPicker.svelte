<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import type dayjs from 'dayjs';
	import _ from 'lodash';
	import { fly } from 'svelte/transition';

	export let month: dayjs.Dayjs;
	$: selectedYear = month.year();
	$: years = _.range(selectedYear - 8, selectedYear + 8);

	function handleChange(event: any) {
		const newYear = event.target.value as number;
		month = month.set('year', newYear);
	}
</script>

{#key selectedYear}
	<select
		style="padding: 0px 2px; text-align: center;"
		id="selector"
		class="selectInput cursor-pointer text-sm hover:border-black/20"
		in:fly={{ y: 3 }}
		value={selectedYear}
		on:change={handleChange}
	>
		{#each years as option}
			<option class={cn(option === selectedYear && 'bg-blueBank/5 font-semibold')} value={option}
				>{option}</option
			>
		{/each}
	</select>
{/key}
