import type dayjs from 'dayjs';

export function getDates(referenceDate: dayjs.Dayjs) {
	const start = referenceDate.startOf('month').startOf('week');
	const end = referenceDate.endOf('month').endOf('week');
	let currentDate = start;
	let dates: dayjs.Dayjs[] = [start];

	while (!currentDate.isSame(end, 'day')) {
		currentDate = currentDate.add(1, 'day');
		dates.push(currentDate);
	}
	return dates;
}
