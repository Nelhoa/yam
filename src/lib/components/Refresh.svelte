<script>
	import { refreshAccounts } from '$lib/utils/Nordigen/frontpoints/accounts-refresh';
</script>

<button on:click={() => refreshAccounts()}> Refresh Account </button>
