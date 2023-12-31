import { get, writable } from 'svelte/store';
import { Game } from './yam';
import type { buildersKey } from './Builders';

const GAMES = 'games';
type GameRow = ReturnType<Game['toStore']>;

export const games = writable<Game[]>([]);

export function loadGames() {
	const gameRows = getGamesStorage();
	if (!gameRows) return;
	games.set(gameRows.map((row) => new Game(row)));
}

export function newGame(builder: buildersKey) {
	const newGame = new Game({ builder });
	games.update((list) => [...list, newGame]);
	setGamesStorage();
	return newGame;
}

export function deleteGame(game: Game) {
	games.update((list) => list.filter((i) => i !== game));
	setGamesStorage();
}

function getGamesStorage() {
	const storage = localStorage.getItem(GAMES);
	if (!storage) return undefined;
	return JSON.parse(storage) as GameRow[];
}

export function setGamesStorage() {
	const storage: GameRow[] = get(games)
		.filter((game) => get(game.grids).length > 0)
		.map((i) => i.toStore());
	const storageString = JSON.stringify(storage);
	localStorage.setItem(GAMES, storageString);
}
