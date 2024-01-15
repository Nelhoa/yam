import type { Grid } from './yam';
import type { CellsGroup } from './Cells';
import { cosquericGrid } from './Builders/cosqueric-grid';
import { parisGrid } from './Builders/paris-grid';
import { foufouGrid } from './Builders/foufou-grid';

export type GridRule = { builder: GridBuilder; title: string; rules: string; deprecated?: true };
export type GridBuilder = (grid: Grid) => CellsGroup[];
export type buildersKey = keyof typeof builders;

export const builders = {
	parisGrid,
	cosquericGrid,
	foufouGrid
} satisfies Record<string, GridRule>;

export const buildersArray = Object.entries(builders) as [buildersKey, GridRule][];

/* 

Ajouter version du jeu
Passage à une nouvelle version = suppression des données sauvegardées

Mode foufou
Juste suite (pas petite suite)

Reset
plus un bouton pour fermer la fenêtre
plus la fenêtre plus grosse
Et on veut voir l’élément sélectionné

Bouton pour recommencer la partie

Contraste entre fond et la grille
Les chiffres sont trop faibles

Affichage du mode

Affichage des règles du jeux

*/
