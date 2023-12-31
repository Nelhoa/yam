import type { NordigenBankDB } from '$lib/types/customTypes';
import type { NDG_Institution } from '$lib/types/nordigen';

export const createBankAccount = async (institution: NDG_Institution, organisation_id: number) => {
	const response = await fetch('/api/nordigen/createBank', {
		method: 'POST',
		body: JSON.stringify({ institution, organisation_id }),
		headers: {
			'content-type': 'application/json',
			authMode: 'session'
		}
	});

	const { newBank, error } = await response.json();
	return { newBank, error } as {
		newBank: NordigenBankDB['Insert'];
		error: unknown;
	};
};
