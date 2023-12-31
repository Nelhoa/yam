import type { Scenario } from '$lib/models/scenario/scenario';
import { writable } from 'svelte/store';

export const scenariosData = writable<ScenarioData[]>([]);

export class ScenarioData {
	endBalances: number[] = [];
	scenario: Scenario;
	isSelected: boolean;
	scenarioColor: string;

	constructor(scenario: Scenario, isSelected: boolean) {
		this.scenarioColor = scenario.color;
		this.scenario = scenario;
		this.isSelected = isSelected;
	}
}
