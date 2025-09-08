import * as svgson from 'svgson';
import * as ClipperLib from 'clipper-lib';

interface Point {
	x: number;
	y: number;
}

interface PathCommand {
	command: string;
	x?: number;
	y?: number;
}

/**
 * Parse un path SVG et retourne une liste de points
 */
function parsePathToPoints(pathData: string): Point[] {
	const points: Point[] = [];
	const commands = pathData.match(/[MLZ][^MLZ]*/g) || [];

	let currentX = 0;
	let currentY = 0;

	for (const command of commands) {
		const cmd = command[0];
		const params = command
			.slice(1)
			.trim()
			.split(/[\s,]+/)
			.filter((p) => p)
			.map(Number);

		switch (cmd) {
			case 'M': // Move to
				currentX = params[0];
				currentY = params[1];
				points.push({ x: currentX, y: currentY });
				break;
			case 'L': // Line to
				for (let i = 0; i < params.length; i += 2) {
					currentX = params[i];
					currentY = params[i + 1];
					points.push({ x: currentX, y: currentY });
				}
				break;
			case 'Z': // Close path
				if (points.length > 0) {
					points.push({ x: points[0].x, y: points[0].y });
				}
				break;
		}
	}

	return points;
}

/**
 * Convertit une liste de points en ClipperLib.IntPoint pour le traitement
 */
function pointsToClipperPath(points: Point[], scale: number = 1000): ClipperLib.IntPoint[] {
	return points.map((p) => ({
		X: Math.round(p.x * scale),
		Y: Math.round(p.y * scale)
	}));
}

/**
 * Convertit un ClipperLib.IntPoint en Point normal
 */
function clipperPathToPoints(path: ClipperLib.IntPoint[], scale: number = 1000): Point[] {
	return path.map((p) => ({
		x: p.X / scale,
		y: p.Y / scale
	}));
}

/**
 * Arrondit les coins d'un polygone
 */
function roundPolygonCorners(points: Point[], radius: number): Point[] {
	if (points.length < 3) return points;

	const roundedPoints: Point[] = [];
	const n = points.length;

	for (let i = 0; i < n - 1; i++) {
		// -1 car le dernier point est souvent une répétition du premier
		const prev = points[(i - 1 + n) % n];
		const curr = points[i];
		const next = points[(i + 1) % n];

		// Calculer les vecteurs
		const v1 = { x: curr.x - prev.x, y: curr.y - prev.y };
		const v2 = { x: next.x - curr.x, y: next.y - curr.y };

		// Normaliser les vecteurs
		const len1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
		const len2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);

		if (len1 === 0 || len2 === 0) {
			roundedPoints.push(curr);
			continue;
		}

		const unit1 = { x: v1.x / len1, y: v1.y / len1 };
		const unit2 = { x: v2.x / len2, y: v2.y / len2 };

		// Calculer l'angle entre les vecteurs
		const dot = unit1.x * unit2.x + unit1.y * unit2.y;
		const angle = Math.acos(Math.max(-1, Math.min(1, dot)));

		// Si l'angle est trop petit, pas besoin d'arrondir
		if (angle > Math.PI * 0.95) {
			roundedPoints.push(curr);
			continue;
		}

		// Calculer la distance pour l'arrondissement
		const distance = Math.min(radius, len1 / 2, len2 / 2);
		const tanHalfAngle = Math.tan(angle / 2);
		const arcDistance = distance / tanHalfAngle;

		if (arcDistance > Math.min(len1, len2) / 2) {
			roundedPoints.push(curr);
			continue;
		}

		// Points de début et fin de l'arc
		const startPoint = {
			x: curr.x - unit1.x * arcDistance,
			y: curr.y - unit1.y * arcDistance
		};

		const endPoint = {
			x: curr.x + unit2.x * arcDistance,
			y: curr.y + unit2.y * arcDistance
		};

		// Ajouter des points pour simuler l'arc (approximation avec des segments)
		const numSegments = Math.max(3, Math.ceil(angle * 4));

		for (let j = 0; j <= numSegments; j++) {
			const t = j / numSegments;
			const arcAngle = -angle * t; // Négatif pour aller dans le bon sens

			// Rotation du vecteur unit1
			const cos = Math.cos(arcAngle);
			const sin = Math.sin(arcAngle);

			const rotatedX = unit1.x * cos - unit1.y * sin;
			const rotatedY = unit1.x * sin + unit1.y * cos;

			const arcPoint = {
				x: curr.x - rotatedX * arcDistance,
				y: curr.y - rotatedY * arcDistance
			};

			roundedPoints.push(arcPoint);
		}
	}

	return roundedPoints;
}

/**
 * Convertit une liste de points en path SVG
 */
function pointsToPath(points: Point[]): string {
	if (points.length === 0) return '';

	let path = `M ${points[0].x.toFixed(3)} ${points[0].y.toFixed(3)}`;

	for (let i = 1; i < points.length; i++) {
		path += ` L ${points[i].x.toFixed(3)} ${points[i].y.toFixed(3)}`;
	}

	path += ' Z';
	return path;
}

/**
 * Fonction principale qui transforme le SVG de QR code
 */
export async function roundQRCodeSVG(svgString: string, pxRadius: number): Promise<string> {
	try {
		// Parser le SVG
		const svgObj = await svgson.parse(svgString);

		// Supprimer le premier rect (fond blanc)
		if (svgObj.children && svgObj.children.length > 0) {
			const firstChild = svgObj.children[0];
			if (
				firstChild.name === 'rect' &&
				firstChild.attributes &&
				firstChild.attributes.style &&
				firstChild.attributes.style.includes('fill:#ffffff')
			) {
				svgObj.children.shift();
			}
		}

		// Traiter chaque path
		const processedChildren = [];

		for (const child of svgObj.children || []) {
			if (child.name === 'path' && child.attributes?.d) {
				try {
					// Parser le path en points
					const points = parsePathToPoints(child.attributes.d);

					if (points.length > 2) {
						// Arrondir les coins
						const roundedPoints = roundPolygonCorners(points, pxRadius);

						// Recréer le path
						const newPath = pointsToPath(roundedPoints);

						// Créer le nouvel élément path
						const newChild = {
							...child,
							attributes: {
								...child.attributes,
								d: newPath
							}
						};

						processedChildren.push(newChild);
					}
				} catch (error) {
					console.warn("Erreur lors du traitement d'un path:", error);
					// En cas d'erreur, garder le path original
					processedChildren.push(child);
				}
			} else {
				// Garder les autres éléments inchangés
				processedChildren.push(child);
			}
		}

		// Reconstruire l'objet SVG
		const newSvgObj = {
			...svgObj,
			children: processedChildren
		};

		// Convertir back en string SVG
		return svgson.stringify(newSvgObj);
	} catch (error) {
		console.error('Erreur lors du traitement du SVG:', error);
		throw new Error(`Impossible de traiter le SVG: ${error.message}`);
	}
}

// Exemple d'utilisation
/*
const svgString = `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 256 256">
  <rect x="0" y="0" width="256" height="256" style="fill:#ffffff;shape-rendering:crispEdges;"></rect>
  <path d="M85.333 85.333 L73.143 85.333 L73.143 73.143 L85.333 73.143 Z" fill="#000000"></path>
</svg>`;

roundQRCodeSVG(svgString, 2).then(result => {
  console.log(result);
});
*/
