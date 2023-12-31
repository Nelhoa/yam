import type { Tick } from 'chart.js/dist/core/core.scale';
import { writable } from 'svelte/store';

export const toolTipShow = writable<boolean>(false);
export const toolTipIndex = writable<number>(0);
export const toolTipPositionX = writable<number>(0);
export const toolTipPositionY = writable<number>(0);
export const toolTipAnchor = writable<undefined | ReturnType<typeof createVirtualAnchor>>();

export function createVirtualAnchor(x: number, y: number) {
	return {
		getBoundingClientRect: () => ({
			width: 0,
			height: 0,
			top: y,
			right: x,
			bottom: y,
			left: x,
			x,
			y
		})
	};
}

export const mainChartTicksStore = writable<Tick[] | undefined>();
