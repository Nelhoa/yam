<script lang="ts">
	import type { ProtoTransaction } from '$lib/models/proto-transaction/proto-transaction';
	import { displayCurrency } from '$lib/utils/Public/Helpers/displayHelpers';
	import { cn } from '$lib/utils/cn';

	export let protoTransaction: ProtoTransaction;
	export let styles = '';
	const { amount, date, title } = protoTransaction;
	$: transactionName = [
		$date?.format('DD/MM/YYYY'),
		$title,
		$amount && displayCurrency($amount, 'EUR')
	]
		.filter((item) => item)
		.join(' ');
</script>

<div
	class={cn('truncate rounded bg-white/5 px-1 text-sm opacity-60', styles)}
	title={transactionName}
>
	{transactionName}
</div>
