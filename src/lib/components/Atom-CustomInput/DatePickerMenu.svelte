<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import dayjs from 'dayjs';
	import _ from 'lodash';
	import { getDates } from './util-date-picker';
	import MonthPicker from './MonthPicker.svelte';
	import { fly } from 'svelte/transition';
	import YearPicker from './YearPicker.svelte';
	import { createEventDispatcher } from 'svelte';
	import NextArrow from '../Icon/NextArrow.svelte';
	import LeftArrow from '../Icon/LeftArrow.svelte';
	import RightArrow from '../Icon/RightArrow.svelte';
	const dispatch = createEventDispatcher();
	const today = dayjs();

	export let date: dayjs.Dayjs | undefined;
	export let suggestedDate = today;
	export let minDate: dayjs.Dayjs | undefined = undefined;
	export let maxDate: dayjs.Dayjs | undefined = undefined;

	let width: number;
	let DateInputElement: HTMLInputElement | undefined;
	let referenceMonth = (date ?? today).clone().startOf('month');
	let dates = getDates(referenceMonth);
	let dateInput = date?.format('DD.MM.YYYY') ?? '';
	let dateInputError = false;
	let focusedDate = date ?? isDateInArray(today) ? today : dates[0]!;
	$: updateDatesList(referenceMonth);

	let MenuElement: HTMLDivElement;
	$: if (MenuElement) MenuElement.addEventListener('wheel', handleMouseWheel);

	function updateDatesList(refMonth: dayjs.Dayjs) {
		dates = getDates(refMonth);
		if (!isDateInArray(focusedDate)) focusedDate = date && isDateInArray(date) ? date : dates[0]!;
	}

	function selectDate(newDate: dayjs.Dayjs) {
		const isBeforeMin = minDate && newDate.isBefore(minDate, 'day');
		const isAfterMax = maxDate && newDate.isAfter(maxDate, 'day');
		if (isBeforeMin || isAfterMax) {
			dateInputError = true;
			DateInputElement?.blur();
			focusedDate = newDate;
			referenceMonth = newDate.startOf('month');
			return;
		}

		dateInputError = false;
		dateInput = newDate.format('DD.MM.YYYY');
		if (!newDate.isSame(referenceMonth, 'month')) referenceMonth = newDate.startOf('month');
		date = newDate;
		DateInputElement?.blur();
		dispatch('select');
	}

	function parseInput() {
		if (dateInput === date?.format('DD.MM.YYYY')) return DateInputElement?.blur();
		const newDate = dateParser(dateInput);
		if (newDate) return selectDate(newDate);
		dateInputError = true;
	}

	function dateParser(input: string): dayjs.Dayjs | undefined {
		if (!input || input.length === 0) return today;
		let [day, month, year] = input.split(/\/|\.|\-/).map(Number);
		let dateParsed: dayjs.Dayjs | undefined;
		if (day && !isNaN(day)) {
			month = month && !isNaN(month) ? month - 1 : today.month();
			year = year && !isNaN(year) ? year : today.year();
			if (_.range(1, 32).includes(day) && _.range(0, 12).includes(month)) {
				dateParsed = dayjs(new Date(year, month, day));
			}
		}
		if (dateParsed && dateParsed.isValid()) return dateParsed;

		dateParsed = dayjs(input);
		if (dateParsed.isValid()) return dateParsed;
		return undefined;
	}

	function handleInputKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter') parseInput();
		if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
			navigate(event.key);
			DateInputElement?.blur();
		}
	}

	function clickOpton(option: dayjs.Dayjs) {
		if (minDate && option.isBefore(minDate, 'day')) return;
		if (maxDate && option.isAfter(maxDate, 'day')) return;
		selectDate(option);
	}

	function selectYear(event: CustomEvent) {
		referenceMonth = referenceMonth.set('year', event.detail);
	}

	function selectMonth(event: CustomEvent) {
		referenceMonth = event.detail;
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (
			event.key === 'ArrowLeft' ||
			event.key === 'ArrowRight' ||
			event.key === 'ArrowUp' ||
			event.key === 'ArrowDown'
		)
			return navigate(event.key);
		if (event.key === 'Enter') {
			if (document.activeElement === DateInputElement) parseInput();
			if (focusedDate) clickOpton(focusedDate);
		}
	}

	function navigate(key: 'ArrowLeft' | 'ArrowRight' | 'ArrowDown' | 'ArrowUp') {
		const newFocusDate = getNewFocusDateOnNavigate(key);
		focusedDate = newFocusDate;
		if (!isDateInArray(newFocusDate))
			referenceMonth = focusedDate?.startOf('month') ?? referenceMonth;
	}

	function getNewFocusDateOnNavigate(
		key: 'ArrowLeft' | 'ArrowRight' | 'ArrowDown' | 'ArrowUp'
	): dayjs.Dayjs {
		if (!focusedDate) {
			const refDate = date ?? suggestedDate;
			if (refDate && referenceMonth.isSame(refDate, 'month')) return refDate;
			return dates[0]!;
		}
		if (key === 'ArrowLeft') return focusedDate?.add(-1, 'day');
		if (key === 'ArrowRight') return focusedDate?.add(1, 'day');
		if (key === 'ArrowUp') return focusedDate?.add(-1, 'week');
		if (key === 'ArrowDown') return focusedDate?.add(1, 'week');
		return suggestedDate;
	}

	function isDateInArray(testedDate: dayjs.Dayjs | undefined) {
		if (!testedDate) return false;
		if (testedDate.isBefore(dates[0], 'day')) return false;
		if (testedDate.isAfter(dates[dates.length - 1], 'day')) return false;
		return true;
	}

	function handleMouseWheel(event: WheelEvent) {
		const offset = event.deltaY > 0 ? 1 : -1;
		referenceMonth = referenceMonth.add(offset, 'month');
	}

	function focus(element: HTMLDivElement) {
		element.focus();
	}
</script>

<svelte:window on:keydown={handleKeyDown} bind:innerWidth={width} />

<div class="w-[230px]" bind:this={MenuElement}>
	{#if width > 600}
		{#key date}
			<input
				use:focus
				in:fly={{ y: 3 }}
				bind:this={DateInputElement}
				type="text"
				class={cn('signInput mb-2 text-center font-mono text-black/70 hover:border-black/20')}
				style="padding: 2px 5px; {dateInputError && 'border-color: red'}"
				bind:value={dateInput}
				on:keydown|stopPropagation={handleInputKeyDown}
				placeholder={suggestedDate.format('DD.MM.YYYY')}
			/>
		{/key}
	{/if}

	<div class="grid h-[25px] grid-cols-[auto_1fr_65px_auto] gap-x-[5px]">
		<button
			class="flex h-full w-[25px] items-center justify-center rounded bg-black/5 font-semibold text-black/30 hover:bg-black/10 hover:text-black/60 focus:outline-none"
			on:click={() => (referenceMonth = referenceMonth.add(-1, 'month'))}
		>
			<LeftArrow />
		</button>
		<MonthPicker bind:month={referenceMonth} on:select={selectMonth} />

		<YearPicker bind:month={referenceMonth} on:select={selectYear} />
		<button
			class="flex h-full w-[25px] items-center justify-center rounded bg-black/5 font-semibold text-black/30 hover:bg-black/10 hover:text-black/60 focus:outline-none"
			on:click={() => (referenceMonth = referenceMonth.add(1, 'month'))}
		>
			<RightArrow />
		</button>
	</div>

	<div class=" mt-2 grid w-full grid-cols-7 gap-[2px]">
		{#each _.slice(dates, 0, 7) as weekday}
			<div class="mb-1 border-b pb-1 text-center font-mono text-sm text-black/50">
				{weekday.format('dd')}
			</div>
		{/each}
		{#each dates as option, index}
			{@const isBeforeMin = minDate && option.isBefore(minDate, 'day')}
			{@const isAfterMax = maxDate && option.isAfter(maxDate, 'day')}
			{#key dates}
				<button
					in:fly|local={{ x: 3, delay: index * 5, duration: 50 }}
					on:click={() => clickOpton(option)}
					class={cn(
						'rounded py-[3px] text-[15px] hover:bg-blueBank/10 focus:outline-none disabled:opacity-30 disabled:hover:bg-none',
						option.isSame(focusedDate, 'day') &&
							!option.isSame(date, 'day') &&
							'shadow outline outline-1 outline-blueBank/30 disabled:opacity-90 disabled:outline-black/10',

						!option.isSame(referenceMonth, 'month') && 'text-black/40',
						option.isSame(today, 'day') && 'border border-blueBank/50 bg-blueBank/5',
						date &&
							option.isSame(date, 'day') &&
							'bg-blueBank/80 font-semibold text-white hover:bg-blueBank'
					)}
					disabled={isBeforeMin || isAfterMax}
				>
					{option.format('D')}
				</button>
			{/key}
		{/each}
	</div>
</div>
