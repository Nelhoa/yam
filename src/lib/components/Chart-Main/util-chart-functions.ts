import type { Chart } from 'chart.js';
import dayjs, { type QUnitType } from 'dayjs';
import { createVirtualAnchor, toolTipAnchor, toolTipIndex, toolTipShow } from './chart-util-stores';

export function getHighLightIndex(
	selectedDate: dayjs.Dayjs | undefined,
	dateArray: dayjs.Dayjs[],
	frequency: QUnitType
) {
	return selectedDate ? findSelectedDateIndex(selectedDate, dateArray, frequency) : -1;
}

function findSelectedDateIndex(
	selectedDate: dayjs.Dayjs,
	dateArray: dayjs.Dayjs[],
	frequency: QUnitType
) {
	for (let i = 0; i < dateArray.length; i++) {
		if (dateArray[i]?.isSame(selectedDate, frequency)) {
			return i;
		}
	}
	return -1;
}

export function handleMouseMove(
	event: MouseEvent,
	chartInstance: Chart,
	chartElement: HTMLCanvasElement
) {
	const chartElements = chartInstance?.getElementsAtEventForMode(
		event,
		'index',
		{ intersect: false },
		false
	);

	const bar = chartElements[0];

	// Position du graphique par rapport à la fenêtre
	const chartRect = chartElement.getBoundingClientRect();

	// Position de l'élément dans le graphique
	const elementX = bar?.element.x ?? 0;
	const elementY = bar?.element.y ?? 0;

	// Position absolue de l'élément par rapport à la fenêtre
	const absoluteX = chartRect.left + elementX;
	const absoluteY = chartRect.top + elementY;

	toolTipAnchor.set(createVirtualAnchor(absoluteX, absoluteY));

	if (chartElements && chartElements.length > 0) {
		chartElement.style.cursor = 'pointer';
		toolTipShow.set(true);
		toolTipIndex.set(chartElements[0]?.index ?? 0);
	} else {
		toolTipShow.set(false);
		chartElement.style.cursor = 'default';
	}
}

export function getTodayTransitionIndex(dates: dayjs.Dayjs[], frequency: QUnitType): number {
	const today = dayjs();
	const lastDateShown = dates[dates.length - 1];
	const firstDateShown = dates[0];
	if (lastDateShown?.isBefore(today, frequency)) return dates.length;
	if (firstDateShown?.isAfter(today, frequency)) return -1;
	for (let i = 0; i < dates.length; i++) {
		if (dates[i]?.isSame(today, frequency)) return i - 1;
	}
	return -1;
}
