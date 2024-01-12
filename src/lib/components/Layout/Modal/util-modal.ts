import { wait } from '$lib/utils/Public/wait';
import { get, writable, type Unsubscriber, type Writable } from 'svelte/store';

let ModalOpened: ModalClass[] = [];
export type ModalElement = ModalClass | undefined;

export function escapeModal(event: KeyboardEvent) {
	if (event.key === 'Escape') closeFirstModal();
}

export class ModalClass {
	element = writable<HTMLElement | undefined>();
	anchor = writable<HTMLElement | undefined>();
	isVisible = writable<boolean>(false);
	parentModal: HTMLElement | undefined;
	unsubscribers: (Unsubscriber | Function)[] = [];

	getAnchor() {
		return get(this.anchor);
	}

	open() {
		ModalOpened = [this, ...ModalOpened];
		this.isVisible.set(true);
		this.addParentCloseFunction();
	}

	close() {
		ModalOpened = ModalOpened.filter((i) => i !== this);
		this.isVisible.set(false);
		this.removeParentCloseFunction();
	}

	closeFromParentModal() {
		console.log('Parent Close');
		this.close();
	}

	closeModalHandler = this.closeFromParentModal.bind(this);

	async addParentCloseFunction() {
		const anchor = get(this.anchor);
		if (!anchor) return;
		const parentModal = anchor.closest('#modal') as HTMLElement | undefined;
		this.parentModal = parentModal;
		if (!parentModal) return;
		await wait(30);
		parentModal.addEventListener('click', this.closeModalHandler);
		parentModal.addEventListener('contextmenu', this.closeModalHandler);
	}

	async removeParentCloseFunction() {
		if (!this.parentModal) return;
		this.parentModal.removeEventListener('click', this.closeModalHandler);
		this.parentModal.removeEventListener('contextmenu', this.closeModalHandler);
	}

	setSubscriber =
		<T>(store: Writable<T>) =>
		(callback: (value: T) => any) =>
			this.unsubscribers.push(store.subscribe((item) => callback(item)));

	listenVisible = this.setSubscriber(this.isVisible);
	switch = () => (get(this.isVisible) ? this.close() : this.open());
	escape = () => null;
	destroy = () => {
		this.unsubscribers.forEach((unsub) => unsub());
		this.removeParentCloseFunction();
		ModalOpened = ModalOpened.filter((i) => i !== this);
	};
}

function closeFirstModal() {
	const modalToClose = ModalOpened[0];
	modalToClose?.close();
}
