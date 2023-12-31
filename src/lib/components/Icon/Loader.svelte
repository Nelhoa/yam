<script lang="ts">
	export let width: number = 100;
	let height = width / 5;
</script>

<svg
	{width}
	{height}
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
	xmlns:xlink="http://www.w3.org/1999/xlink"
	style="background: rgba(241, 242, 243, 0); display: block; shape-rendering: auto;"
	viewBox="0 0 100 20"
	preserveAspectRatio="xMidYMid"
>
	<circle cx="84" cy="10" r="10">
		<animate
			attributeName="r"
			repeatCount="indefinite"
			dur="0.7142857142857142s"
			calcMode="spline"
			keyTimes="0;1"
			values="9;0"
			keySplines="0 0.5 0.5 1"
			begin="0s"
		/>
		<animate
			attributeName="fill"
			repeatCount="indefinite"
			dur="2.8571428571428568s"
			calcMode="discrete"
			keyTimes="0;0.25;0.5;0.75;1"
			begin="0s"
		/>
	</circle><circle cx="16" cy="10" r="10">
		<animate
			attributeName="r"
			repeatCount="indefinite"
			dur="2.8571428571428568s"
			calcMode="spline"
			keyTimes="0;0.25;0.5;0.75;1"
			values="0;0;9;9;9"
			keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
			begin="0s"
		/>
		<animate
			attributeName="cx"
			repeatCount="indefinite"
			dur="2.8571428571428568s"
			calcMode="spline"
			keyTimes="0;0.25;0.5;0.75;1"
			values="16;16;16;50;84"
			keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
			begin="0s"
		/>
	</circle><circle cx="50" cy="10" r="10">
		<animate
			attributeName="r"
			repeatCount="indefinite"
			dur="2.8571428571428568s"
			calcMode="spline"
			keyTimes="0;0.25;0.5;0.75;1"
			values="0;0;9;9;9"
			keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
			begin="-0.7142857142857142s"
		/>
		<animate
			attributeName="cx"
			repeatCount="indefinite"
			dur="2.8571428571428568s"
			calcMode="spline"
			keyTimes="0;0.25;0.5;0.75;1"
			values="16;16;16;50;84"
			keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
			begin="-0.7142857142857142s"
		/>
	</circle><circle cx="84" cy="10" r="10">
		<animate
			attributeName="r"
			repeatCount="indefinite"
			dur="2.8571428571428568s"
			calcMode="spline"
			keyTimes="0;0.25;0.5;0.75;1"
			values="0;0;9;9;9"
			keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
			begin="-1.4285714285714284s"
		/>
		<animate
			attributeName="cx"
			repeatCount="indefinite"
			dur="2.8571428571428568s"
			calcMode="spline"
			keyTimes="0;0.25;0.5;0.75;1"
			values="16;16;16;50;84"
			keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
			begin="-1.4285714285714284s"
		/>
	</circle><circle cx="16" cy="10" r="10">
		<animate
			attributeName="r"
			repeatCount="indefinite"
			dur="2.8571428571428568s"
			calcMode="spline"
			keyTimes="0;0.25;0.5;0.75;1"
			values="0;0;9;9;9"
			keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
			begin="-2.142857142857143s"
		/>
		<animate
			attributeName="cx"
			repeatCount="indefinite"
			dur="2.8571428571428568s"
			calcMode="spline"
			keyTimes="0;0.25;0.5;0.75;1"
			values="16;16;16;50;84"
			keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
			begin="-2.142857142857143s"
		/>
	</circle>
</svg>
