export function groupSVGRects(svgString) {
	// Parser le SVG
	const parser = new DOMParser();
	const doc = parser.parseFromString(svgString, 'image/svg+xml');
	const svg = doc.documentElement;

	// Extraire tous les rectangles noirs (fill:#000000)
	const rects = Array.from(svg.querySelectorAll('rect[style*="fill:#000000"]'));

	// Convertir les rectangles en objets avec leurs propriétés
	const rectData = rects.map((rect, index) => ({
		element: rect,
		x: parseFloat(rect.getAttribute('x')),
		y: parseFloat(rect.getAttribute('y')),
		width: parseFloat(rect.getAttribute('width')),
		height: parseFloat(rect.getAttribute('height')),
		index: index,
		grouped: false
	}));

	// Fonction pour vérifier si deux rectangles partagent au moins deux sommets
	function sharesTwoVertices(rect1, rect2) {
		const r1 = {
			x1: rect1.x,
			y1: rect1.y,
			x2: rect1.x + rect1.width,
			y2: rect1.y + rect1.height
		};

		const r2 = {
			x1: rect2.x,
			y1: rect2.y,
			x2: rect2.x + rect2.width,
			y2: rect2.y + rect2.height
		};

		// Vérifier adjacence horizontale (même y, x adjacents)
		if (r1.y1 === r2.y1 && r1.y2 === r2.y2) {
			return Math.abs(r1.x2 - r2.x1) < 0.01 || Math.abs(r2.x2 - r1.x1) < 0.01;
		}

		// Vérifier adjacence verticale (même x, y adjacents)
		if (r1.x1 === r2.x1 && r1.x2 === r2.x2) {
			return Math.abs(r1.y2 - r2.y1) < 0.01 || Math.abs(r2.y2 - r1.y1) < 0.01;
		}

		return false;
	}

	// Fonction pour trouver tous les rectangles connectés à partir d'un rectangle donné
	function findConnectedGroup(startRect, allRects) {
		const group = [startRect];
		const toCheck = [startRect];
		startRect.grouped = true;

		while (toCheck.length > 0) {
			const current = toCheck.pop();

			for (const rect of allRects) {
				if (!rect.grouped && sharesTwoVertices(current, rect)) {
					rect.grouped = true;
					group.push(rect);
					toCheck.push(rect);
				}
			}
		}

		return group;
	}

	// Créer les groupes
	const groups = [];
	for (const rect of rectData) {
		if (!rect.grouped) {
			const group = findConnectedGroup(rect, rectData);
			groups.push(group);
		}
	}

	// Créer le nouveau SVG avec les groupes
	const newSvg = svg.cloneNode(false); // Clone sans les enfants

	// Copier les attributs du SVG original
	Array.from(svg.attributes).forEach((attr) => {
		newSvg.setAttribute(attr.name, attr.value);
	});

	// Ajouter le rectangle de fond blanc
	const backgroundRect = svg.querySelector('rect[style*="fill:#ffffff"]');
	if (backgroundRect) {
		newSvg.appendChild(backgroundRect.cloneNode(true));
	}

	// Créer un groupe pour chaque ensemble de rectangles connectés
	groups.forEach((group, groupIndex) => {
		const g = doc.createElement('g');
		g.setAttribute('id', `group-${groupIndex}`);
		g.setAttribute('data-rect-count', group.length.toString());

		// Ajouter tous les rectangles du groupe
		group.forEach((rectInfo) => {
			g.appendChild(rectInfo.element.cloneNode(true));
		});

		newSvg.appendChild(g);
	});

	// Convertir le résultat en string
	const serializer = new XMLSerializer();
	let result = serializer.serializeToString(newSvg);

	// Nettoyer le formatage XML
	result = result.replace(/>\s+</g, '><');

	return {
		svg: result,
		groupCount: groups.length,
		totalRects: rectData.length,
		groups: groups.map((group, index) => ({
			id: `group-${index}`,
			rectCount: group.length,
			bounds: calculateGroupBounds(group)
		}))
	};
}

// Fonction utilitaire pour calculer les limites d'un groupe
function calculateGroupBounds(group) {
	let minX = Infinity,
		minY = Infinity;
	let maxX = -Infinity,
		maxY = -Infinity;

	group.forEach((rect) => {
		minX = Math.min(minX, rect.x);
		minY = Math.min(minY, rect.y);
		maxX = Math.max(maxX, rect.x + rect.width);
		maxY = Math.max(maxY, rect.y + rect.height);
	});

	return {
		x: minX,
		y: minY,
		width: maxX - minX,
		height: maxY - minY
	};
}
