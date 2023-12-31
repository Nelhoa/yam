import { langage } from '$lib/stores/language-store';
import { get } from 'svelte/store';

export function displayNumber(number: any, decimals = 2) {
	return Intl.NumberFormat(get(langage).intl, { maximumFractionDigits: decimals }).format(
		Number(number)
	);
}

export function displayCurrency(number: any, currency: string, decimals = 2) {
	const initialFormat = Intl.NumberFormat(get(langage).intl, {
		style: 'currency',
		currency,
		maximumFractionDigits: decimals
	}).format(Number(number));
	return Intl.NumberFormat(get(langage).intl, {
		style: 'currency',
		currency,
		maximumFractionDigits: decimals,
		notation: initialFormat.length > 11 ? 'compact' : 'standard'
	}).format(Number(number));
}

export function firstLetterToUpperCase(text: string): string {
	if (text.length === 0) {
		return text;
	}
	return text.charAt(0).toUpperCase() + text.slice(1);
}
