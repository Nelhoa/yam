<script>
	import QRCode from 'qrcode-svg';
	import { groupSVGRects } from './group-square';
	import { minimiseSVG } from './minimise';
	import { roundQRCodeSVG } from './clean-qr-code';

	let url = 'https://example.com'; // valeur par défaut
	let svgCode = '';
	generate();

	async function generate() {
		const qr = new QRCode({
			content: url,
			padding: 0,
			container: 'svg-viewbox', // pour que ça prenne la bonne taille
			join: false
		});
		svgCode = await minimiseSVG(groupSVGRects(qr.svg()).svg);
	}

	function download() {
		const blob = new Blob([svgCode], { type: 'image/svg+xml' });
		const link = document.createElement('a');
		link.href = URL.createObjectURL(blob);
		link.download = 'qrcode.svg';
		link.click();
		URL.revokeObjectURL(link.href);
	}
</script>

<div class="mx-auto w-[84vw] max-w-[400px] py-5">
	<h1 class="mb-5 text-xl font-bold">QR Code</h1>
	<!-- <div class="mb-1 text-sm font-semibold">Votre URL</div> -->
	<input
		class="w-full rounded border border-black/10 px-3 py-1"
		type="text"
		bind:value={url}
		on:input={generate}
		placeholder="Entrez une URL"
	/>
	<!-- affichage du SVG -->
	<div class="w-full py-8">
		{@html svgCode}
	</div>

	<button
		class="rounded bg-cyan-500 px-3 py-1 font-semibold text-white hover:bg-cyan-600"
		on:click={download}>Télécharger (SVG)</button
	>
</div>
