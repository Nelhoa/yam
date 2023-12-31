<script lang="ts">
	import { cn } from '$lib/utils/cn';

	export let className: string = '';
	export let pattern: CanvasPattern;
	let canvas: HTMLCanvasElement;

	$: if (canvas) {
		const ctx = canvas.getContext('2d');
		canvas.width = canvas.clientWidth;
		canvas.height = canvas.clientHeight;
		if (ctx) {
			ctx.fillStyle = pattern;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
		}
	}
</script>

<canvas class={cn('', className)} bind:this={canvas} />
