export function getNextTabElement(button: HTMLElement): HTMLElement | null {
	const focusableElements = Array.from(
		document.querySelectorAll(
			'a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
		)
	).filter((el) => !el.hasAttribute('disabled'));

	const currentIndex = focusableElements.indexOf(button);

	return currentIndex !== -1 && currentIndex + 1 < focusableElements.length
		? (focusableElements[currentIndex + 1] as HTMLElement)
		: null;
}
