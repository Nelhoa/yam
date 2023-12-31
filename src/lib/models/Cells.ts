import { get, writable, type Readable } from 'svelte/store';
import type { Grid } from './yam';

export type AnyCell = CellEditable | DerivedCell;

export type CellsGroup = { cells: AnyCell[]; name: string };

export class Cell {
	grid: Grid;
	name: string;
	description?: string;

	constructor(name: string, grid: Grid, description?: string) {
		this.name = name;
		this.description = description;
		this.grid = grid;
	}
}

export class CellEditable extends Cell {
	score = writable<number>(0);
	isDone = writable<boolean>(false);
	autorisedValues: number[];

	constructor(
		grid: Grid,
		autorisedValues: number[] | { min: number; max: number; increment: number },
		name: string,
		description?: string
	) {
		super(name, grid, description);
		if (Array.isArray(autorisedValues)) {
			this.autorisedValues = autorisedValues;
		} else {
			const { min, max, increment } = autorisedValues;
			this.autorisedValues = [];
			for (let i = min; i <= max; i = i + increment) {
				this.autorisedValues.push(i);
			}
		}
	}

	toStore() {
		return {
			name: this.name,
			isDone: get(this.isDone),
			score: get(this.score)
		};
	}

	setScore(value: number) {
		this.score.set(value);
		this.isDone.set(true);
		this.grid.game.sortGrids();
		this.grid.game.save();
	}

	resetScore() {
		this.score.set(0);
		this.isDone.set(false);
		this.grid.game.sortGrids();
		this.grid.game.save();
	}
}

export class DerivedCell extends Cell {
	score: Readable<number>;

	constructor(grid: Grid, derivedScore: Readable<number>, name: string, description?: string) {
		super(name, grid, description);
		this.score = derivedScore;
	}
}
