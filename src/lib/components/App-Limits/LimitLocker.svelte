<script lang="ts">
	import Lock from '../Icon/Lock.svelte';

	export let locked: boolean = false;

	function lockMount(element: HTMLElement) {
		const parent = element.parentElement;
		if (!parent) return;
		const oldPosition = parent.style.position;
		parent.style.position = 'relative';
		element.style.display = 'block';

		return {
			destroy() {
				parent.style.position = oldPosition;
			}
		};
	}
</script>

{#if locked}
	<div
		use:lockMount
		class="absolute right-0 top-0 -mr-[9px] -mt-[9px] hidden rounded bg-white/90 p-[3px] text-blueBank"
	>
		<Lock width={11} />
	</div>
{/if}
