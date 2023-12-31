<script lang="ts">
	import Papa from 'papaparse';
	import Dropzone from 'svelte-file-dropzone/Dropzone.svelte';
	import tinycolor from 'tinycolor2';

	export let datas: unknown | undefined;
	let file: File | undefined;
	let error: string | undefined;
	let isHover = false;

	function parseCSV(fileInput: File) {
		return new Promise((resolve) => {
			Papa.parse(fileInput, {
				complete: (result) => {
					resolve(result.data);
				},
				header: true
			});
		});
	}

	async function readCSV(fileInput: File) {
		const datas = await parseCSV(fileInput);
		return datas;
	}

	async function handleFilesSelect(e: CustomEvent) {
		isHover = false;
		const { acceptedFiles, fileRejections } = e.detail;
		if (fileRejections) {
			error = 'Fichier incompatible';
			datas = undefined;
			file = undefined;
		}
		if (acceptedFiles[0]) {
			error = undefined;
			file = acceptedFiles[0];
			if (!(file instanceof File)) return;
			datas = await readCSV(file);
			return;
		}
	}
</script>

<Dropzone
	containerStyles="{file
		? `border-color: ${tinycolor('#009CFF').setAlpha(0.1)}; background-color: ${tinycolor(
				'#009CFF'
		  ).setAlpha(0.05)}; `
		: ''} {error ? `border-color: ${tinycolor('red').setAlpha(0.5)}; ` : ''} {isHover
		? 'border-color: #009CFF;'
		: ''}"
	on:dragenter={() => (isHover = true)}
	on:dragleave={() => (isHover = false)}
	multiple={false}
	on:drop={handleFilesSelect}
	accept=".csv"
	inputElement={undefined}
>
	{#if file}
		<div class="w-full truncate font-semibold text-black/80" title={file.name}>
			{file.name}
		</div>
	{:else if error}
		<div class="w-full truncate font-semibold text-black/80" title={error}>
			{error}
		</div>
	{:else}
		Déposer un fichier
	{/if}
</Dropzone>

<div style="border-style: solid;"></div>
