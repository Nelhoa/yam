import type dayjs from 'dayjs';

export type ListenedDatas = {
	dateArray: dayjs.Dayjs[];
	transactionsIn: number[];
	transactionsOut: number[];
	transitionIndex: number;
	hightLightIndex: number;
	estimatesKeptsIn: number[];
	estimatesKeptsOut: number[];
	commitsIn: number[];
	commitsOut: number[];
};

export enum chartIndex {
	VARIATION,
	TRANSACTION_IN,
	TRANSACTION_OUT,
	COMMITS_IN,
	COMMITS_OUT,
	ESTIMATES_IN,
	ESTIMATES_OUT
}
