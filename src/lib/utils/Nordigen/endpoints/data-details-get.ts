import type { NDG_AccountDetails } from '$lib/types/nordigen';
import type { AccessToken } from './access-token-get';
import { NordigenURL } from './url';

export async function getDetails(accessToken: AccessToken, account_id: string) {
	const res_getDetails = await fetch(`${NordigenURL}/api/v2/accounts/${account_id}/details/`, {
		method: 'GET',
		headers: {
			accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${accessToken.access}`
		}
	});

	const res = await res_getDetails.json();
	if (res.status_code) throw res;
	return res as NDG_AccountDetails;
}
