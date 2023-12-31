import type { NDG_Balances } from '$lib/types/nordigen';
import type { AccessToken } from './access-token-get';
import { NordigenURL } from './url';

export async function getBalances(accessToken: AccessToken, account_id: string) {
	const res_getBalances = await fetch(`${NordigenURL}/api/v2/accounts/${account_id}/balances/`, {
		method: 'GET',
		headers: {
			accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${accessToken.access}`
		}
	});

	const res = await res_getBalances.json();
	if (res.status_code) throw res;
	return res as { balances: NDG_Balances };
}
