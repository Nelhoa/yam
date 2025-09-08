import { parse, stringify } from 'svgson';
import ClipperLib from 'clipper-lib';
import { removeDoubles } from './removeDoubles';

export async function minimiseSVG(svgString: string) {
	const svgJson = await parse(svgString);

	const scale = 1000; // travailler sur des entiers pour Clipper

	function rectToPolygon(rect: any) {
		const x = Math.round(parseFloat(rect.attributes.x) * scale);
		const y = Math.round(parseFloat(rect.attributes.y) * scale);
		const w = Math.round(parseFloat(rect.attributes.width) * scale);
		const h = Math.round(parseFloat(rect.attributes.height) * scale);
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
		clipperPolygons.forEach((poly) => c.AddPath(poly, ClipperLib.PolyType.ptSubject, true));

		const solution: ClipperLib.Paths = [];
		c.Execute(
			ClipperLib.ClipType.ctUnion,
			solution,
			ClipperLib.PolyFillType.pftNonZero,
			ClipperLib.PolyFillType.pftNonZero
		);

		// Nettoyer et arrondir pour la grille
		const cleaned = solution.map((poly) => ClipperLib.Clipper.CleanPolygon(poly, 0));

		const pathD = cleaned
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
