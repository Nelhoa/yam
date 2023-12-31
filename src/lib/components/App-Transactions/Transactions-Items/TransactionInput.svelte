<script lang="ts">
	import CustomInput from '$lib/components/Atom-CustomInput/OLDCustomInput.svelte';
	import type { Transaction } from '$lib/models/datas/transaction';
	import { cn } from '$lib/utils/cn';
	export let transaction: Transaction;
	export let styles = '';
	const name = transaction.name;
</script>

<div class="h-full truncate text-left text-black/70 first-letter:uppercase">
	<CustomInput
		inputValue={$name}
		className={cn('text-left', styles)}
		update={(i) => transaction.updateCustomName(i)}
		branchName="transactionsName"
		inputType="text"
	/>
</div>
