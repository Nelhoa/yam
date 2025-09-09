import { parse, stringify } from 'svgson';
import ClipperLib from 'clipper-lib';
import { removeDoubles } from './removeDoubles';

export async function minimiseSVG(svgString: string) {
	const svgJson = await parse(svgString);

	const scale = 1000000; // Très haute précision pour éviter les erreurs d'arrondi

	function normalizeCoord(value: number): number {
		// Forcer l'alignement sur une grille très fine
		return Math.round(value * 100000) / 100000;
	}

	function rectToPolygon(rect: any) {
		const x = Math.round(normalizeCoord(parseFloat(rect.attributes.x)) * scale);
		const y = Math.round(normalizeCoord(parseFloat(rect.attributes.y)) * scale);
		const w = Math.round(normalizeCoord(parseFloat(rect.attributes.width)) * scale);
		const h = Math.round(normalizeCoord(parseFloat(rect.attributes.height)) * scale);
		return [
			{ X: x, Y: y },
			{ X: x + w, Y: y },
			{ X: x + w, Y: y + h },
			{ X: x, Y: y + h }
		];
	}

	function gRectsToPath(g: any) {
		const rects = g.children.filter((c: any) => c.name === 'rect');
		if (!rects.length) return null;

		const clipperPolygons = rects.map(rectToPolygon);

		const c = new ClipperLib.Clipper();
		c.StrictlySimple = true; // Forcer des polygones simples

		clipperPolygons.forEach((poly) => c.AddPath(poly, ClipperLib.PolyType.ptSubject, true));

		const solution: ClipperLib.Paths = [];
		c.Execute(
			ClipperLib.ClipType.ctUnion,
			solution,
			ClipperLib.PolyFillType.pftNonZero,
			ClipperLib.PolyFillType.pftNonZero
		);

		// Ne pas nettoyer du tout pour voir si c'est ça qui cause le problème
		const pathD = solution
			.map((polygon) => 'M' + polygon.map((p) => `${p.X / scale} ${p.Y / scale}`).join('L') + 'Z')
			.join(' ');

		return pathD;
	}

	function traverse(node: any) {
		if (node.name === 'g') {
			const d = gRectsToPath(node);
			if (d) {
				node.name = 'path';
				node.attributes = { d, fill: '#000000' };
				node.children = [];
			}
		} else if (node.children) {
			node.children.forEach(traverse);
		}
	}

	traverse(svgJson);
	return removeDoubles(stringify(svgJson));
}
