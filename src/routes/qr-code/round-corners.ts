import { parsePath, roundCorners } from 'svg-round-corners';

/**
 * Arrondit les angles d'un SVG en utilisant svg-round-corners
 * @param svgString - Le SVG en string (résultat de minimiseSVG)
 * @param radius - Le rayon d'arrondi des angles (défaut: 10)
 * @param round - Le facteur d'arrondi, entre 0 et 1 (défaut: 1)
 * @returns Le SVG avec les angles arrondis
 */
export function roundSVGCorners(svgString: string, radius: number = 10, round: number = 1): string {
	// Expression régulière pour extraire les attributs 'd' des éléments path
	const pathRegex = /<path[^>]*\sd="([^"]*)"[^>]*>/g;

	let result = svgString;
	let match;

	// Traiter chaque élément path trouvé
	while ((match = pathRegex.exec(svgString)) !== null) {
		const originalPath = match[1];
		const fullPathElement = match[0];

		try {
			// Parser la chaîne de path en commandes
			// const parsedPath = parsePath(originalPath!);

			// Arrondir les commandes du path
			const roundedPathString = roundCorners(originalPath!, radius, round).path;

			// Convertir les commandes arrondies en string
			// const roundedPathString = roundedCommands
			// 	.map((cmd) => {
			// 		const type = cmd.code;
			// 		const values = cmd.values ? cmd.values.join(' ') : '';
			// 		return `${type}${values ? ' ' + values : ''}`;
			// 	})
			// 	.join(' ');

			// Remplacer l'ancien path par le nouveau avec les angles arrondis
			const newPathElement = fullPathElement.replace(
				`d="${originalPath}"`,
				`d="${roundedPathString}"`
			);

			result = result.replace(fullPathElement, newPathElement);
		} catch (error) {
			console.warn(`Erreur lors de l'arrondi du path: ${originalPath}`, error);
			// En cas d'erreur, on garde le path original
		}
	}

	return result;
}

/**
 * Version alternative qui parse et reconstruit le SVG (plus robuste)
 */
export async function roundSVGCornersAdvanced(
	svgString: string,
	radius: number = 10,
	round: number = 1
): Promise<string> {
	// Si vous avez accès à svgson (comme dans votre fonction minimiseSVG)
	const { parse, stringify } = await import('svgson');

	try {
		const svgJson = await parse(svgString);

		function traverseAndRound(node: any) {
			if (node.name === 'path' && node.attributes.d) {
				try {
					// Parser le path string en commandes SVG
					const commands = parsePath(node.attributes.d);

					// Arrondir les commandes du path
					const roundedCommands = roundCommands(commands, radius, round);

					// Convertir les commandes arrondies en string
					const roundedPathString = roundedCommands
						.map((cmd) => {
							const type = cmd.code;
							const values = cmd.values ? cmd.values.join(' ') : '';
							return `${type}${values ? ' ' + values : ''}`;
						})
						.join(' ');

					node.attributes.d = roundedPathString;
				} catch (error) {
					console.warn(`Erreur lors de l'arrondi du path:`, error);
				}
			}

			if (node.children) {
				node.children.forEach(traverseAndRound);
			}
		}

		traverseAndRound(svgJson);
		return stringify(svgJson);
	} catch (error) {
		console.error('Erreur lors du parsing du SVG:', error);
		// Fallback vers la méthode regex
		return roundSVGCorners(svgString, radius, round);
	}
}
