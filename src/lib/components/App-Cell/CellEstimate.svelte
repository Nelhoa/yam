<script lang="ts">
	import type { Estimate } from '$lib/models/datas/estimate';
	import CustomInput from '../Atom-CustomInput/OLDCustomInput.svelte';
	import ThreeDots from '../Icon/ThreeDots.svelte';

	export let estimate: Estimate;
	const category = estimate.category;
</script>

<div
	class="grid h-[32px] grid-cols-[80px_1fr_30px] items-center border-b border-b-black/5 bg-blueBank/5 px-2 last:border-none"
>
	<CustomInput
		inputValue={estimate.info.value}
		inputType={'number'}
		branchName={$category?.name ?? ''}
		update={(n) => estimate.updateValue(n)}
		className="text-left px-1"
	/>
	<CustomInput
		inputValue={estimate.info.title}
		className="text-left w-full truncate px-2"
		update={(n) => estimate.updateTitle(n)}
		branchName="estimate"
		inputType="text"
	/>
	<div
		class="flex h-full w-full items-center justify-center px-2 text-black/20 hover:text-black/50"
	>
		<ThreeDots width={15} />
	</div>
</div>
