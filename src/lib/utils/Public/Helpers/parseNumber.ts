export function parseNumber(str: string) {
	const normalized = str.replace(/\s/g, '').replace(',', '.');
	return parseFloat(normalized);
}
