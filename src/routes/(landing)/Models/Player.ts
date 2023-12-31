import { writable } from 'svelte/store';
import { YamUtil } from './utils';
import type { Grid } from './yam';

export class Player {
	name: string;
	id: number;
	grids = writable<Grid[]>([]);

	constructor(name: string, id?: number) {
		this.name = name;
		this.id = YamUtil.getPlayerId(id);
	}

	toStore() {
		return {
			id: this.id,
			name: this.name
		};
	}
}
