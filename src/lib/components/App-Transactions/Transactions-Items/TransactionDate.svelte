<script lang="ts">
	import type { Transaction } from '$lib/models/datas/transaction';
	export let transaction: Transaction;
</script>

<div class="truncate pl-2 text-black/40">
	{transaction.bookingDate?.format('Do MMM')}
</div>
