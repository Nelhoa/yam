export function removeDoubles(svgString: string): string {
	// Remplace tous les "d" des <path> par des versions filtrées
	return svgString.replace(/(<path[^>]*d=")([^"]+)(")/g, (_match, prefix, d, suffix) => {
		// On split par commande SVG (M, L, C, etc.) et on filtre les doublons consécutifs
		const commands = d.match(/[MLCQAZ][^MLCQAZ]*/gi);
		if (!commands) return d;

		const filtered: string[] = [];
		let lastCoords: string | null = null;

		for (const cmd of commands) {
			const coords = cmd.trim();
			if (coords !== lastCoords) {
				filtered.push(coords);
				lastCoords = coords;
			}
		}

		return prefix + filtered.join(' ') + suffix;
	});
}
