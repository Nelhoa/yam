import { PUBLIC_SITE_URL } from '$env/static/public';
import type { NordigenBankDB } from '$lib/types/customTypes';

export const resetNordigenBank = async (bankId: number, API_KEY: string) => {
	const response = await fetch(`${PUBLIC_SITE_URL}/api/nordigen/resetBank`, {
		method: 'POST',
		body: JSON.stringify({ bankId }),
		headers: {
			'content-type': 'application/json',
			Authorization: API_KEY
		}
	});
	const { bankRow, error } = await response.json();
	return { bankRow, error } as {
		bankRow: NordigenBankDB['Row'];
		error: unknown;
	};
};
