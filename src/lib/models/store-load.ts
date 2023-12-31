import { loadGames } from './store-games';
import { loadPlayers } from './store-players';

export function loadYamStores() {
	loadPlayers();
	loadGames();
}
