<script lang="ts">
	import type { Commit } from '$lib/models/datas/commit';
	import { CommitStatus } from '$lib/models/datas/util-commit-status';
	import { displayCurrency } from '$lib/utils/Public/Helpers/displayHelpers';
	import copyToClipBoard from '$lib/utils/Public/copyToClipboard';
	import { wait } from '$lib/utils/Public/wait';
	import { cn } from '$lib/utils/cn';

	import Modal from '../Layout/Modal/Modal.svelte';
	import type { ModalElement } from '../Layout/Modal/util-modal';

	export let commit: Commit;
	const { title, category, payDate, amount, status, linkedTransactionId } = commit;

	let MenuModal: ModalElement;
	let openOnMouse = true;
	$: isMenuOpen = MenuModal?.isVisible;

	async function openMenu() {
		openOnMouse = true;
		await wait(20);
		MenuModal?.open();
	}
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	on:contextmenu|preventDefault={openMenu}
	class={cn(
		'grid grid-cols-[2fr_58px_2fr_2fr_1fr] items-center gap-[10px] border border-transparent border-b-black/5 px-4 py-1 text-[15px] hover:bg-blueBank/[3%]',
		$isMenuOpen && ' rounded border-blueBank/50 bg-white shadow shadow-blueBank/20'
	)}
>
	<div class="truncate">
		{$title}
	</div>
	<div class="truncate text-sm">{payDate.format('Do MMM')}</div>
	<div class="truncate text-sm">{displayCurrency(amount, 'EUR')}</div>
	<div class={cn('flex items-center justify-start gap-2 truncate rounded  text-sm font-semibold ')}>
		<div
			class={cn(
				'h-[10px] w-[10px] rounded-sm',
				status === 'closed' && 'bg-green-500',
				status === 'onTime' && 'bg-blueBank',
				status === 'pushed' && 'bg-yellow-500',
				status === 'late' && 'bg-red-500'
			)}
		></div>
		<div>
			{CommitStatus[status].fr}
		</div>
	</div>
	<div class="truncate">{linkedTransactionId ?? ''}</div>
</div>

<Modal
	modalStyles="border-blueBank/50  border px-3 py-2 flex flex-col gap-2 justify-stretch"
	buttonStyles="hidden"
	bind:Modal={MenuModal}
	bind:openOnMouse
>
	<svelte:fragment slot="menu">
		<button on:click={() => console.log(commit.getRow())}>Log commit</button>
		<button
			on:click={() => {
				MenuModal?.close();
				commit.delete();
			}}>Supprimer</button
		>
		<button
			on:click={() => {
				MenuModal?.close();
				copyToClipBoard(String(commit.id));
			}}>Copier l'id</button
		>
	</svelte:fragment>
</Modal>
