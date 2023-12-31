import { derived } from 'svelte/store';
import type { GridBuilder, GridRule } from '../Builders';
import { CellEditable, DerivedCell, type CellsGroup } from '../Cells';
import { YamUtil } from '../utils';

const builder: GridBuilder = (grid) => {
	const numbers = [
		new CellEditable(grid, [1, 2, 3, 4, 5], 'Uns'),
		new CellEditable(grid, [2, 4, 6, 8, 10], 'Deux'),
		new CellEditable(grid, [3, 6, 9, 12, 15], 'Trois'),
		new CellEditable(grid, [4, 8, 12, 16, 20], 'Quatre'),
		new CellEditable(grid, [5, 10, 15, 20, 25], 'Cinq'),
		new CellEditable(grid, [6, 12, 18, 24, 30], 'Six')
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

	const plus = new CellEditable(grid, { min: 5, max: 30, increment: 1 }, 'Plus');
	const moins = new CellEditable(grid, { min: 5, max: 30, increment: 1 }, 'Moins');
	const bonusMoinsPlus = new DerivedCell(
		grid,
		derived(
			[numbers[0]!.score, plus.score, moins.score, numbers[0]!.isDone, plus.isDone, moins.isDone],
			([uns, plus, moins, unDone, plusDone, moinsDone]) => {
				if (!unDone || !plusDone || !moinsDone) return 0;
				if (plus <= 0) return 0;
				if (moins <= 0) return 0;
				if (plus - moins <= 0) return 0;
				const total = (plus - moins) * uns;
				if (total <= 0) return 0;
				return total;
			}
		),
		'Bonus des uns'
	);

	const plusMoinsGroup: CellsGroup = {
		cells: [plus, moins, bonusMoinsPlus],
		name: 'Plus & Moins'
	};

	const bottomGroup: CellsGroup = {
		cells: [
			new CellEditable(grid, { min: 5, max: 30, increment: 1 }, 'Brelan'),
			new CellEditable(grid, [20], 'Suite'),
			new CellEditable(grid, [30], 'Full'),
			new CellEditable(grid, [40], 'Carré'),
			new CellEditable(grid, [50], 'Yam'),
			new CellEditable(grid, { min: 5, max: 30, increment: 1 }, 'Chance')
		],
		name: 'Combinaisons'
	};

	return [numberGroup, plusMoinsGroup, bottomGroup];
};

export const foufouGrid2: GridRule = {
	builder,
	title: 'Foufou Mode',
	rules: ''
};
