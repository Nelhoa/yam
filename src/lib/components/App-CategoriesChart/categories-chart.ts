import { Chart } from 'chart.js';
import _ from 'lodash';
import type { Organisation } from '$lib/models/structurals/organisation';
import type { Span } from '$lib/models/spans/span';
import type { MainChartTheme } from '../Chart-Main/chart-colors';
import type { Category } from '$lib/models/categories/category';
import type { Cell } from '$lib/models/spans/cell';
import { getChartData } from './categories-chart-data';
import { getChartOptions } from './categories-chart-options';

export class CategoriesChart extends Chart {
	span: Span;
	organisation: Organisation;
	categoriesArray: [Category, Cell][];
	categoriesName: string[];
	transactions: number[];
	estimatesImpact: number[];
	commits: number[];
	theme: MainChartTheme;

	constructor(
		element: HTMLCanvasElement,
		span: Span,
		organisation: Organisation,
		theme: MainChartTheme,
		categoriesArray: [Category, Cell][],
		firstOutcomeIndex: number
	) {
		const categoryNames = categoriesArray.map(([key]) => key.name);
		const transactions = categoriesArray.map(([key, value]) => value.transactions.global);
		const estimatesImpact = categoriesArray.map(([key, value]) => value.estimatesImpact);
		const commits = categoriesArray.map(([key, value]) => value.commits.global);

		super(element, {
			data: getChartData(
				categoryNames,
				transactions,
				estimatesImpact,
				commits,
				firstOutcomeIndex,
				theme
			),
			options: getChartOptions(theme)
		});

		this.theme = theme;
		this.categoriesArray = categoriesArray;
		this.categoriesName = categoryNames;
		this.transactions = transactions;
		this.estimatesImpact = estimatesImpact;
		this.commits = commits;
		this.span = span;
		this.organisation = organisation;
	}
}
