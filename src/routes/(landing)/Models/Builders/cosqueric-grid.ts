import { derived } from 'svelte/store';
import type { GridBuilder, GridRule } from '../Builders';
import { CellEditable, DerivedCell, type CellsGroup } from '../Cells';
import { YamUtil } from '../utils';

const builder: GridBuilder = (grid) => {
	const numbers = [
		new CellEditable(grid, [1, 2, 3, 4, 5], 'Les uns'),
		new CellEditable(grid, [2, 4, 6, 8, 10], 'Les deux'),
		new CellEditable(grid, [3, 6, 9, 12, 15], 'Les trois'),
		new CellEditable(grid, [4, 8, 12, 16, 20], 'Les quatre'),
		new CellEditable(grid, [5, 10, 15, 20, 25], 'Les cinq'),
		new CellEditable(grid, [6, 12, 18, 24, 30], 'Les six')
	];
	const numberBonus = new DerivedCell(
		grid,
		derived(
			numbers.map((i) => i.score),
			(scores) => {
				const total = YamUtil.getSum(scores);
				if (total >= 60) return 35;
				return 0;
			}
		),
		'Bonus'
	);

	const numberGroup: CellsGroup = {
		cells: [...numbers, numberBonus],
		name: 'Les nombres'
	};

	const plusMoinsGroup: CellsGroup = {
		cells: [
			new CellEditable(grid, { min: 5, max: 30, increment: 1 }, 'Plus'),
			new CellEditable(grid, { min: 5, max: 30, increment: 1 }, 'Moins')
		],
		name: 'Plus & Moins'
	};

	const bottomGroup: CellsGroup = {
		cells: [
			new CellEditable(grid, [20], 'Suite'),
			new CellEditable(grid, [30], 'Full'),
			new CellEditable(grid, [40], 'Carré'),
			new CellEditable(grid, [50], 'Yam')
		],
		name: 'Combinaisons'
	};

	return [numberGroup, plusMoinsGroup, bottomGroup];
};

export const cosquericGrid: GridRule = {
	builder,
	title: 'Mode Cosquéric',
	rules: 'Le bonus aux nombre s’obtient avec 60 points.'
};
