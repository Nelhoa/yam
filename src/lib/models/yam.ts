import type { Prettify } from '$lib/types/customTypes';
import dayjs from 'dayjs';
import _ from 'lodash';
import { derived, get, writable, type Readable } from 'svelte/store';
import { builders, type GridBuilder, type buildersKey } from './Builders';
import { CellEditable, type AnyCell, type CellsGroup } from './Cells';
import { YamUtil } from './utils';
import type { Player } from './Player';
import { setGamesStorage } from './store-games';

export type GameRow = ReturnType<Game['toStore']>;

export class Game {
	id: number;
	date: dayjs.Dayjs;
	dateString: string;
	grids = writable<Grid[]>([]);
	selectedGrid = writable<Grid | undefined>();
	builder: GridBuilder;
	builderName: keyof typeof builders;
	builderTitle: string;
	builderRules: string;
	gridMode = writable<boolean>(true);

	constructor(row: Prettify<Partial<GameRow>>) {
		this.builderName = row.builder ?? 'cosquericGrid';
		this.date = row?.dateString ? dayjs(row.dateString) : dayjs();
		this.dateString = row.dateString ?? this.date.toString();
		const builderData = builders[this.builderName];
		this.builder = builderData.builder;
		this.builderTitle = builderData.title;
		this.builderRules = builderData.rules;
		this.id = YamUtil.getGameId(row?.id);
		row.grids?.forEach((gridRow) => new Grid({ player: null, row: gridRow }, this));
	}

	addGrid(player: Player) {
		new Grid({ player, row: null }, this);
		this.save();
	}

	toStore() {
		return {
			id: this.id,
			builder: this.builderName,
			dateString: this.dateString,
			grids: get(this.grids).map((grid) => grid.toStore())
		};
	}

	sortGrids() {
		// this.grids.update((grids) => _.orderBy(grids, (grid) => get(grid.score), 'desc'));
	}

	save() {
		setGamesStorage();
	}

	removePlayer(player: Player) {
		this.grids.update((list) => list.filter((grid) => grid.player !== player));
		this.save();
	}
}

type GridRowParams = { player: Player; row: null } | { player: null; row: GameRow['grids'][0] };
export class Grid {
	id: number;
	cellsGroups: CellsGroup[];
	editableCells: CellEditable[];
	cells: AnyCell[];
	percentFinished: Readable<number>;
	score: Readable<number>;
	player: Player;
	game: Game;

	constructor({ player, row }: GridRowParams, game: Game) {
		this.id = YamUtil.getGridId(row?.id);

		player = player ?? YamUtil.getPlayerFromId(row.playerId);
		this.player = player;
		this.game = game;
		this.cellsGroups = game.builder(this);
		this.cells = YamUtil.cellsfromGroupToArray(this.cellsGroups);
		this.editableCells = this.cells.filter(
			(cell) => cell instanceof CellEditable
		) as CellEditable[];

		this.score = derived(
			this.cells.map((cell) => cell.score),
			(scores) => scores.reduce((prev, cur) => prev + cur, 0)
		);
		this.percentFinished = derived(
			this.editableCells.map((cell) => cell.isDone),
			(isDones) => {
				const doneCells = isDones.filter((i) => i);
				return doneCells.length / isDones.length;
			}
		);
		if (row?.cells) {
			row.cells.forEach((cellRow) => {
				const cell = this.editableCells.find((i) => i.name === cellRow.name)!;
				cell.score.set(cellRow.score);
				cell.isDone.set(cellRow.isDone);
			});
			this.game.sortGrids();
		}
		this.player.grids.update((list) => [...list, this]);
		this.game.grids.update((list) => [...list, this]);
		this.select();
	}

	select() {
		this.game.selectedGrid.set(this);
	}

	remove() {
		this.player.grids.update((list) => list.filter((i) => i != this));
		this.game.grids.update((list) => list.filter((i) => i != this));
		const newSelectedGrid = get(this.game.grids)?.[0];
		this.game.selectedGrid.set(newSelectedGrid);
		this.game.save();
	}

	toStore() {
		return {
			id: this.id,
			gameId: this.game.id,
			playerId: this.player.id,
			cells: this.editableCells.map((i) => i.toStore())
		};
	}
}
