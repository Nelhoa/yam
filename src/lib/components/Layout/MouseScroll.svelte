<script lang="ts">
	let container: HTMLDivElement;
	let isMouseDown = false;
	let startX: number;
	let scrollLeft: number;

	function onMouseDown(e: MouseEvent) {
		isMouseDown = true;
		startX = e.pageX - container.offsetLeft;
		scrollLeft = container.scrollLeft;
	}

	function onMouseLeave() {
		isMouseDown = false;
	}

	function onMouseUp() {
		isMouseDown = false;
	}

	function onMouseMove(e: MouseEvent) {
		if (!isMouseDown) return;
		e.preventDefault();
		const x = e.pageX - container.offsetLeft;
		const walk = (x - startX) * 2; // La vitesse de défilement, ajustez cette valeur en fonction de vos préférences
		container.scrollLeft = scrollLeft - walk;
	}
</script>

<div
	class="scroll-container"
	bind:this={container}
	on:mousedown={onMouseDown}
	on:mouseleave={onMouseLeave}
	on:mouseup={onMouseUp}
	on:mousemove={onMouseMove}
>
	<div class="scroll-content">
		<slot />
	</div>
</div>

<style>
	.scroll-container {
		overflow: hidden;
		cursor: grab;
		width: 100%;
		height: 300px; /* Ajustez la hauteur en fonction de vos besoins */
	}
	.scroll-content {
		white-space: nowrap;
		font-size: 24px;
		padding: 10px;
	}
</style>
