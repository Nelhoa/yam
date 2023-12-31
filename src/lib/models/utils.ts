import { get } from 'svelte/store';
import { players } from './store-players';
import type { AnyCell, CellsGroup } from './Cells';

const playerIds: number[] = [];
const gameIds: number[] = [];
const gridIds: number[] = [];

export namespace YamUtil {
	export function getSum(numbers: number[]) {
		return numbers.reduce((p, c) => p + c, 0);
	}

	export function getPlayerId(id?: number) {
		if (!id) id = playerIds.length > 0 ? (Math.max(...playerIds) ?? 0) + 1 : 1;
		playerIds.push(id);
		return id;
	}

	export function getGameId(id?: number) {
		if (!id) id = gameIds.length > 0 ? (Math.max(...gameIds) ?? 0) + 1 : 1;
		gameIds.push(id);
		return id;
	}

	export function getGridId(id?: number) {
		if (!id) id = gridIds.length > 0 ? (Math.max(...gridIds) ?? 0) + 1 : 1;
		gridIds.push(id);
		return id;
	}

	export function getPlayerFromId(id: number) {
		const player = get(players).find((item) => item.id === id);
		if (!player) throw Error('No player found with given id');
		return player;
	}

	export function cellsfromGroupToArray(groups: CellsGroup[]) {
		let cells: AnyCell[] = [];
		for (const group of groups) {
			cells = [...cells, ...group.cells];
		}
		return cells;
	}
}
