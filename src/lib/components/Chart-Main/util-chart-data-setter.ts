import type { DatasetStyle } from './chart-colors';
import tinycolor from 'tinycolor2';
import type { ChartData, ScriptableContext, ScriptableLineSegmentContext } from 'chart.js';

export function setBorderDash(transitionIndex: number) {
	return (ctx: ScriptableLineSegmentContext) => (ctx.p0.parsed.x > transitionIndex ? [5, 5] : []);
}

const unselectedScenarioOpacity = 0.25;

export function getChartScenarioVariation(
	variation: number[],
	transitionIndex: number,
	color: string,
	scenarioName: string,
	isSelected: boolean
) {
	return {
		type: 'line',
		label: scenarioName,
		data: variation,
		borderColor: tinycolor(color)
			.setAlpha(isSelected ? 1 : unselectedScenarioOpacity)
			.toRgbString(),
		pointRadius: isSelected ? 4 : 0,
		pointHoverRadius: isSelected ? 8 : 3,
		pointBorderColor: 'transparent',
		pointBackgroundColor: color,
		pointHoverBackgroundColor: color,
		tension: 0.25,
		order: isSelected ? 0 : 10,
		showLine: true,
		borderWidth: 2.5,
		segment: {
			borderDash: setBorderDash(transitionIndex)
		}
	} satisfies ChartData['datasets'][0];
}

export function updateScenarioGraph(
	variation: number[],
	color: string,
	isSelected: boolean,
	dataset: ChartData<'line'>['datasets'][0],
	newTransitionIndex: number
) {
	dataset.data = variation;
	dataset.borderColor = tinycolor(color)
		.setAlpha(isSelected ? 1 : unselectedScenarioOpacity)
		.toRgbString();
	dataset.pointBackgroundColor = isSelected ? color : 'transparent';
	dataset.order = isSelected ? 0 : 10;
	dataset.segment = {
		borderDash: setBorderDash(newTransitionIndex)
	};
	dataset.pointRadius = isSelected ? 4 : 0;
	dataset.pointHoverRadius = isSelected ? 8 : 3;
	return dataset;
}

export function setColor(hightLightIndex: number, colorAtIndex: any, color: any) {
	return (ctx: ScriptableContext<'bar'>) => {
		if (ctx.dataIndex === hightLightIndex) return colorAtIndex;
		return color;
	};
}

export function getChartBar(
	data: number[],
	hightLightIndex: number,
	stack: 'in' | 'out',
	label: string,
	style: DatasetStyle
) {
	return {
		type: 'bar',
		label,
		data,
		stack,
		borderRadius: 2,
		borderWidth: 0,
		order: 3,
		backgroundColor: setColor(hightLightIndex, style.colorSelected, style.color),
		hoverBackgroundColor: setColor(hightLightIndex, style.colorSelectedHover, style.colorHover)
	} satisfies ChartData['datasets'][0];
}
