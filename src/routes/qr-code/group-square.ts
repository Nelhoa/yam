interface Rect {
	x: number;
	y: number;
	width: number;
	height: number;
	element: Element;
}

interface Point {
	x: number;
	y: number;
}

export function groupAdjacentRects(svg: SVGSVGElement): SVGSVGElement {
	// Récupérer tous les éléments rect (en excluant le fond blanc)
	const rectElements = Array.from(svg.querySelectorAll('rect')).filter(
		(rect) => rect.getAttribute('fill') !== '#ffffff'
	);

	// Créer une représentation des rectangles
	const rects: Rect[] = rectElements.map((element) => {
		const x = parseFloat(element.getAttribute('x') || '0');
		const y = parseFloat(element.getAttribute('y') || '0');
		const width = parseFloat(element.getAttribute('width') || '0');
		const height = parseFloat(element.getAttribute('height') || '0');

		return { x, y, width, height, element };
	});

	// Fonction pour vérifier si deux rectangles sont adjacents
	function areRectsAdjacent(rect1: Rect, rect2: Rect): boolean {
		// Vérifier l'adjacence horizontale
		const horizontalAdjacent =
			(rect1.x + rect1.width === rect2.x || rect2.x + rect2.width === rect1.x) &&
			rect1.y === rect2.y &&
			rect1.height === rect2.height;

		// Vérifier l'adjacence verticale
		const verticalAdjacent =
			(rect1.y + rect1.height === rect2.y || rect2.y + rect2.height === rect1.y) &&
			rect1.x === rect2.x &&
			rect1.width === rect2.width;

		return horizontalAdjacent || verticalAdjacent;
	}

	// Trouver tous les groupes de rectangles adjacents
	const groups: Rect[][] = [];
	const processed = new Set<Rect>();

	for (const rect of rects) {
		if (processed.has(rect)) continue;

		const group: Rect[] = [rect];
		processed.add(rect);

		let index = 0;
		while (index < group.length) {
			const currentRect = group[index];

			// Trouver tous les rectangles adjacents non traités
			for (const otherRect of rects) {
				if (!processed.has(otherRect) && areRectsAdjacent(currentRect, otherRect)) {
					group.push(otherRect);
					processed.add(otherRect);
				}
			}

			index++;
		}

		groups.push(group);
	}

	// Créer une copie du SVG pour ne pas modifier l'original
	const resultSvg = svg.cloneNode(true) as SVGSVGElement;

	// Supprimer tous les rectangles (sauf le fond)
	const resultRects = Array.from(resultSvg.querySelectorAll('rect')).filter(
		(rect) => rect.getAttribute('fill') !== '#ffffff'
	);

	resultRects.forEach((rect) => rect.remove());

	// Ajouter les groupes
	groups.forEach((groupRects) => {
		if (groupRects.length === 0) return;

		const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');

		groupRects.forEach((rect) => {
			const rectElement = rect.element.cloneNode(true) as SVGRectElement;
			group.appendChild(rectElement);
		});

		resultSvg.appendChild(group);
	});

	return resultSvg;
}

// Fonction utilitaire pour parser un SVG string
export function parseSVG(svgString: string): SVGSVGElement {
	const parser = new DOMParser();
	const doc = parser.parseFromString(svgString, 'image/svg+xml');
	return doc.documentElement as unknown as SVGSVGElement;
}

// Fonction utilitaire pour convertir SVG en string
export function svgToString(svg: SVGSVGElement): string {
	const serializer = new XMLSerializer();
	return serializer.serializeToString(svg);
}

// Exemple d'utilisation
/*
const svgElement = parseSVG(votreSVGString);
const groupedSVG = groupAdjacentRects(svgElement);
const resultString = svgToString(groupedSVG);
console.log(resultString);
*/
