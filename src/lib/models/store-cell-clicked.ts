import { writable } from 'svelte/store';
import type { CellEditable } from './Cells';

export const cellClicked = writable<CellEditable | undefined>();
