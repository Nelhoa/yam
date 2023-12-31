import { Chart, type ChartData } from 'chart.js';
import type { chartIndex, ListenedDatas } from './util-chart-type';
import { emptyLine, getChartData } from './main-chart-data';
import { getBarsStyle, type barKey, type MainChartTheme } from './chart-colors';
import { getChartOptions, highLighter } from './main-chart-options';
import _ from 'lodash';
import type dayjs from 'dayjs';
import { firstLetterToUpperCase } from '$lib/utils/Public/Helpers/displayHelpers';
import { getHighLightIndex, getTodayTransitionIndex } from './util-chart-functions';
import { getChartScenarioVariation, setColor, updateScenarioGraph } from './util-chart-data-setter';
import type { QUnitType } from 'dayjs';
import type { ScenarioData } from './scenarios-data-store';
import type { Organisation } from '$lib/models/structurals/organisation';
import { mainChartTicksStore } from './chart-util-stores';
import type { Tick } from 'chart.js/dist/core/core.scale';

type ScenarioDrawed = {
	data: ScenarioData;
	dataset: ChartData['datasets'][0];
};

export class MainChart extends Chart {
	theme: MainChartTheme;
	dateArray: dayjs.Dayjs[];
	selectedDate: dayjs.Dayjs | null;
	frequency: QUnitType;
	scenariosDisplayed: ScenarioDrawed[] = [];
	organisation: Organisation;

	constructor(
		element: HTMLCanvasElement,
		data: ListenedDatas,
		spanSelect: Function,
		theme: MainChartTheme,
		selectedDate: dayjs.Dayjs | null,
		frequency: QUnitType,
		organisation: Organisation
	) {
		super(element, {
			data: getChartData(data, theme),
			options: getChartOptions(spanSelect, theme)
		});
		this.theme = theme;
		this.dateArray = data.dateArray;
		this.selectedDate = selectedDate;
		this.frequency = frequency;
		this.organisation = organisation;
		this.setTicks();
	}

	setTicks() {
		const yAxis = this.scales.y;
		if (!yAxis) return;
		mainChartTicksStore.set(yAxis.ticks as Tick[]);
	}

	customUpdate(mode?: Parameters<typeof this.update>[0]) {
		this.update(mode);
		this.setTicks();
	}

	updateLabels(newDates: dayjs.Dayjs[]) {
		this.dateArray = newDates;
		const newLabels = newDates.map((item) => firstLetterToUpperCase(item.format('MMM')));
		this.data.labels = newLabels;
		this.customUpdate('none');
		this.select(this.selectedDate);
	}

	updateDataset(index: chartIndex, newData: number[]) {
		let dataset = this.data.datasets[index];
		if (!dataset) throw Error('Impossible de trouver le dataset souhaité');
		dataset.data = newData;
		this.customUpdate();
	}

	updateViewedScenariosDataset(updatedScenarios: ScenarioData[]) {
		const newTransitionIndex = getTodayTransitionIndex(this.dateArray, this.frequency);

		//Displayed scenarios not needed anymore are removed from graph
		this.scenariosDisplayed.forEach((displayed) => {
			const isKept = updatedScenarios.find((toDisplay) => toDisplay === displayed.data);
			const firstDataset = this.data.datasets[0];
			if (!isKept) {
				this.scenariosDisplayed.filter((viewed) => viewed !== displayed);
				if (displayed.dataset === firstDataset) this.data.datasets[0] = emptyLine;
				this.data.datasets = this.data.datasets.filter((dataset) => dataset !== displayed.dataset);
			}
		});

		//Every other datas are updated or addedd
		updatedScenarios.forEach((scenario) => {
			let displayed = this.scenariosDisplayed.find(
				(scenarioView) => scenarioView.data === scenario
			);
			if (displayed) {
				displayed.dataset = updateScenarioGraph(
					scenario.endBalances,
					scenario.scenarioColor,
					scenario.isSelected,
					displayed.dataset as ChartData<'line'>['datasets'][0],
					newTransitionIndex
				);
			} else {
				displayed = {
					data: scenario,
					dataset: getChartScenarioVariation(
						scenario.endBalances,
						newTransitionIndex,
						scenario.scenarioColor,
						scenario.scenario.name,
						scenario.isSelected
					)
				};
				this.scenariosDisplayed.push(displayed);
				this.data.datasets.push(displayed.dataset);
			}
		});
		this.customUpdate();
	}

	select(selectedDate: dayjs.Dayjs | null) {
		this.selectedDate = selectedDate;
		const newHighLightIndex = selectedDate
			? getHighLightIndex(selectedDate, this.dateArray, this.frequency)
			: -1;
		const styles = getBarsStyle(this.theme);
		Object.keys(styles).forEach((keyElement) => {
			const key = keyElement as barKey;
			const style = styles[key];
			const dataset = this.getDataSet(style.index);
			dataset.backgroundColor = setColor(newHighLightIndex, style.colorSelected, style.color);
			dataset.hoverBackgroundColor = setColor(
				newHighLightIndex,
				style.colorHover,
				style.colorSelectedHover
			);
		});
		highLighter.xMin = newHighLightIndex - 0.5;
		highLighter.xMax = newHighLightIndex + 0.5;
		highLighter.display = selectedDate ? true : false;
		this.customUpdate('none');
	}

	getDataSet(dataIndex: chartIndex) {
		const dataset = this.data.datasets[dataIndex];
		if (!dataset) throw Error('Impossible de trouver le dataset souhaité');
		return dataset;
	}
}
