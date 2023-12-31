import type { NDG_Requisition } from '$lib/types/nordigen';
import type { AccessToken } from './access-token-get';
import { NordigenURL } from './url';

export async function getRequisition(accessToken: AccessToken, init_id: string) {
	const res_getRequisition = await fetch(`${NordigenURL}/api/v2/requisitions/${init_id}/`, {
		method: 'GET',
		headers: {
			accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${accessToken.access}`
		}
	});
	const res = await res_getRequisition.json();
	if (res.status_code) throw res;
	return res as NDG_Requisition;
}
