<script lang="ts">
	export let portalId: string;

	function portal(element: HTMLElement) {
		let target: HTMLBodyElement | null;
		function update() {
			target = document.querySelector(`#${portalId}`);
			target?.appendChild(element);
			element.style.visibility = '';
		}
		function destroy() {
			if (element.parentNode) element.parentNode.removeChild(element);
		}
		update();
		return { update, destroy };
	}
</script>

<div class="hidden">
	<div style="visibility: hidden" use:portal class="flex">
		<slot />
	</div>
</div>
