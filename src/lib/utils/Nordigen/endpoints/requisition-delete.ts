import type { AccessToken } from './access-token-get';
import { NordigenURL } from './url';

export async function deleteRequisition(accessToken: AccessToken, init_id: string) {
	const res = await fetch(`${NordigenURL}/api/v2/requisitions/${init_id}/`, {
		method: 'DELETE',
		headers: {
			accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${accessToken.access}`
		}
	});
	const data = await res.json();
	if (data.status_code) throw res;
	return data;
}
