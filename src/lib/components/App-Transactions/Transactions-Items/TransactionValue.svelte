<script lang="ts">
	import type { Transaction } from '$lib/models/datas/transaction';
	import { cn } from '$lib/utils/cn';
	export let transaction: Transaction;
	export let styles = '';
	let plus = transaction.amount > 0;
</script>

<div class={cn('truncate px-3 text-right', plus && 'font-semibold text-green-500', styles)}>
	{transaction.displayAmount()}
</div>
