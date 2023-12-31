import { get, writable } from 'svelte/store';
import { Player } from './Player';
import { games } from './store-games';

const PLAYERS = 'Players';
type PlayerStore = ReturnType<Player['toStore']>;

export const players = writable<Player[]>([]);

export function loadPlayers() {
	const playersStorage = getPlayersStorage();
	if (!playersStorage) return;
	players.set(playersStorage.map((item) => new Player(item.name, item.id)));
}

export function newPlayer(name: string) {
	const newPlayer = new Player(name);
	players.update((list) => [...list, newPlayer]);
	setPlayersStorage();
	return newPlayer;
}

export function deletePlayer(player: Player) {
	players.update((list) => list.filter((i) => i != player));
	get(games).forEach((game) => game.removePlayer(player));
	setPlayersStorage();
}

function getPlayersStorage() {
	const storage = localStorage.getItem(PLAYERS);
	if (!storage) return undefined;
	return JSON.parse(storage) as PlayerStore[];
}

function setPlayersStorage() {
	const storage: PlayerStore[] = get(players).map((i) => i.toStore());
	const storageString = JSON.stringify(storage);
	localStorage.setItem(PLAYERS, storageString);
}
