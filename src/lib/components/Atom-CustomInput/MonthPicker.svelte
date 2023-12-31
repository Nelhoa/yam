<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import dayjs from 'dayjs';
	import _ from 'lodash';
	import { createEventDispatcher } from 'svelte';
	import { fly } from 'svelte/transition';
	const dispatch = createEventDispatcher();

	export let month: dayjs.Dayjs;
	let previousMonth: dayjs.Dayjs | undefined;
	let months = getMonths(month);
	$: selectedMonth = month.startOf('month').format('YYYY-MM-DD');
	$: if (!previousMonth?.isSame(month, 'year')) updateMonths();

	function updateMonths() {
		months = getMonths(month);
		previousMonth = month;
	}

	function getMonths(date: dayjs.Dayjs): dayjs.Dayjs[] {
		let start = date.startOf('year');
		let end = date.endOf('year').startOf('month');

		let currentDate = start;
		const newMonths: dayjs.Dayjs[] = [start];

		while (!currentDate.isSame(end, 'month')) {
			currentDate = currentDate.add(1, 'month');
			newMonths.push(currentDate);
		}
		return newMonths;
	}

	function select(event: any) {
		const newMonth = event.target.value as number;
		dispatch('select', dayjs(newMonth));
	}
</script>

{#key month}
	<select
		style="padding: 0px 1px; text-align: center;"
		class="selectInput cursor-pointer text-sm hover:border-black/20"
		in:fly={{ y: 3 }}
		value={selectedMonth}
		on:change={select}
	>
		{#each months as option}
			<option
				class={cn(option.isSame(month, 'month') && 'bg-blueBank/5 font-semibold')}
				value={option.format('YYYY-MM-DD')}>{option.format('MMMM')}</option
			>
		{/each}
	</select>
{/key}
