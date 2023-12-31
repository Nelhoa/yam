<script lang="ts">
	export let number: number;
	export let limit: number;
</script>

<div class="mb-3">
	<div class="grid grid-cols-[1fr_auto] gap-2 font-semibold">
		<div class="truncate">
			Scenario{limit > 1 ? 's' : ''}
		</div>
		<div>
			<span class="number">{number}</span> /
			<span class="number">{limit}</span>
		</div>
	</div>
</div>
