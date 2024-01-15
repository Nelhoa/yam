import tinycolor from 'tinycolor2';

const index1Color = {
	selected: new tinycolor('white').setAlpha(0.5),
	highlighted: new tinycolor('white').setAlpha(0.1),
	normal: tinycolor('black').setAlpha(0.15)
} as const;

const index0Color: typeof index1Color = {
	selected: index1Color.selected,
	highlighted: tinycolor('white').setAlpha(0.15),
	normal: tinycolor('white').setAlpha(0.06)
};

export const col = [index0Color, index1Color] as const;
